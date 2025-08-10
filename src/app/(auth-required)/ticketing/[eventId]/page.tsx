'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import UserInfoModal from '@/components/modals/ticketing/UserInfoModal';
import { fetchClient } from '@/api/clients/fetchClient';
import { FetchSnackDetailResponse, TicketEvent } from '@/interfaces/SnackEvent';
import { formatDateTimeWithDay } from '@/utils/date';
import { env } from 'process';

export default function SnackDetail() {
    const router = useRouter();
    const { eventId }  = useParams();
    const [isInfo, setIsInfo] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [eventData, setEventData] = useState<TicketEvent | null>(null);
    const [ticketStatus, setTicketStatus] = useState<'available' | 'upcoming' | 'countdown' | 'closed'>('closed');
    const [remainingTime, setRemainingTime] = useState('00:00');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSelected, setIsSelected] = useState<'info' | 'note'>('info')
    //sse 관련
    const sseRef = useRef<EventSource | null>(null);
    const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

//  SSE 구독: currentQuantity 실시간 업데이트 ---
useEffect(() => {
  if (!eventId) return;

  const id = Array.isArray(eventId) ? eventId[0] : eventId;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/ticketing/sse/subscribe/${id}`;
  console.log('[SSE] connect try:', url);

  // 기존 연결 정리
  if (sseRef.current) {
    console.log('[SSE] close previous');
    sseRef.current.close();
    sseRef.current = null;
  }

  const es = new EventSource(url, { withCredentials: true });
  sseRef.current = es;

  es.onopen = () => {
    console.log('[SSE] OPEN (readyState=', es.readyState, ')');
  };

  // 커스텀 이벤트: ticketing-stock-sse
  const onStock = (evt: MessageEvent<any>) => {
    console.log('[SSE] ticketing-stock-sse RAW:', evt);
    console.log('[SSE] ticketing-stock-sse DATA:', evt.data);

    // data가 JSON/문자 혼용일 수 있으니 안전 파싱
    let payload: any = evt.data;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch {}
    }

    if (payload && typeof payload.quantity === 'number') {
      console.log('[SSE] -> update currentQuantity =', payload.quantity);
      setEventData(prev => (prev ? { ...prev, currentQuantity: payload.quantity } : prev));
    } else {
      console.warn('[SSE] ticketing-stock-sse: quantity 없음/형식 불일치:', payload);
    }
  };

  // 커스텀 이벤트: heartbeat
  const onHeartbeat = (evt: MessageEvent<any>) => {
    console.log('[SSE] heartbeat:', evt.data);
  };

  // 혹시 기본 메시지도 올 수 있으니 onmessage도 로깅
  es.onmessage = (evt) => {
    console.log('[SSE] DEFAULT message:', evt.data);
  };

  es.addEventListener('ticketing-stock-sse', onStock as EventListener);
  es.addEventListener('heartbeat', onHeartbeat as EventListener);

  es.onerror = (err) => {
    console.error('[SSE] ERROR (readyState=', es.readyState, '):', err);
    // es.close();  // 자동 재연결을 막고 싶지 않다면 닫지 마세요
  };

  return () => {
    console.log('[SSE] CLEANUP: close');
    es.removeEventListener('ticketing-stock-sse', onStock as EventListener);
    es.removeEventListener('heartbeat', onHeartbeat as EventListener);
    es.close();
  };
}, [eventId]);



    useEffect(() => {
        const fetchDetail = async () => {
            setIsLoading(true);
            try {
                const response = await fetchClient<FetchSnackDetailResponse>(`/ticketing/event/${eventId}`);
                setEventData(response.data);
                setIsInfo(response.data.existParticipationData);
                if (response.data.existParticipationData == false) setShowModal(true);
                console.log(response);
            } catch (err) {
                console.error('❌ 이벤트 상세 불러오기 실패:', err);
                setErrorMessage('이벤트 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [eventId]);

    useEffect(() => {
        if (!eventData) return;

        const updateTicketStatus = () => {
            const ticketDate = new Date(eventData.eventTime);
            const now = new Date();
            const diffSec = Math.floor((ticketDate.getTime() - now.getTime()) / 1000);

            if (eventData.eventStatus === "ACTIVE" && diffSec <= 0) {
                setTicketStatus('available');
                setRemainingTime('00:00');
            } else if (eventData.eventStatus === "UPCOMING" && diffSec <= 180) {
                setTicketStatus('countdown');
                const min = String(Math.floor(diffSec / 60)).padStart(2, '0');
                const sec = String(diffSec % 60).padStart(2, '0');
                setRemainingTime(`${min}:${sec}`);
            } else if (eventData.eventStatus === 'ENDED'){
                setTicketStatus('closed');
            } else {
                setTicketStatus('upcoming');
            }
        };

        updateTicketStatus();
        const interval = setInterval(updateTicketStatus, 1000);
        return () => clearInterval(interval);
    }, [eventData]);

    const handleTicketClick = async () => {
        setIsLoading(true);
        try {
            const res = await fetchClient(`/ticketing/event/join/${eventId}`, { method: 'POST' });

            if (res.code === 200) {
            // ✅ 티켓팅 성공
            router.push(`/ticketing/result?status=success&eventId=${eventId}`);
            } else if (res.code === 409) {
            // ✅ 티켓 매진
            router.push(`/ticketing/result?status=soldout&eventId=${eventId}`);
            } else {
            // ✅ 기타 오류
            router.push(`/ticketing/result?status=error&eventId=${eventId}`);
            }
        } catch (err: any) {
            console.error('티켓팅 실패', err);
            router.push(`/ticketing/result?status=error&eventId=${eventId}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Suspense>
            <Header>
                <Header.BackButton onClick={() => router.back()} />
                <Header.Title>간식나눔</Header.Title>
            </Header>

            <DefaultBody hasHeader={1}>
                {isLoading && <LoadingOverlay />}
                {showModal && (
                    <UserInfoModal
                        onClose={() => setShowModal(false)}
                        onComplete={() => {
                        setIsInfo(true);          // ✅ 입력 완료 상태 설정
                        setShowModal(false);      // ✅ 모달 닫기
                        }}
                        initialStep={isInfo ? 2 : 1}
                    />
                    )}
               
                {errorMessage && (
                    <div className="text-red-500 text-center my-4 text-sm">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && !eventData && !errorMessage && (
                    <div className="text-gray-500 text-center mt-4">이벤트 정보를 불러올 수 없습니다.</div>
                )}

                {!isLoading && eventData && (
                    <div className="flex flex-col items-center gap-4">
                        <div className='w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] py-[29px] px-4'>
                            <img src={eventData.eventImageUrls || "/images/default.svg"} alt="간식 이미지" />
                        </div>

                        <div className="w-full">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-row items-start font-semibold text-[18px]">잔여 수량<span className="text-[#0D99FF] ml-1 mt-[-10px]">•</span></div>
                                <div className="text-[#0D99FF] font-semibold text-[18px]">{eventData.currentQuantity}개 </div>
                            </div>
                            <div className="text-[12px] text-black mt-1">실시간으로 업데이트 됩니다.</div>
                        </div>

                        <div className='w-full border-t border-[#D4D4D4]'></div>

                        <div className='flex flex-col items-center'>
                            <div className="text-sm text-black mt-2 text-center font-medium leading-[17px]">
                                {isInfo ? '수령자 정보를 이미 입력했어요.' : <>빠른 티켓팅을 위해 수령자 <br /> 정보를 먼저 입력해주세요.</>}
                            </div>
                            <button
                                className="mt-3 text-white text-[12px] px-[22px] py-[6px] gap-[10px] bg-[#0D99FF] rounded-[20px]"
                                onClick={() => setShowModal(true)}
                            >
                                {isInfo ? '수령자 정보 수정' : '수령자 정보 입력'}
                            </button>
                        </div>

                        <div className={`w-full flex justify-end text-[11px] text-[#0D99FF] gap-3 `}>
                            <button className={` ${isSelected === 'note' && ('text-[#AEAEAE] ')} underline`} onClick={()=>setIsSelected('info')}>상세정보</button>
                            <button className={` ${isSelected === 'info' && ('text-[#AEAEAE] ')} underline`} onClick={()=>setIsSelected('note')}>유의사항</button>
                        </div>

                        <div className="flex flex-col w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] p-4 text-[12px] text-black gap-y-1">
                            {isSelected === 'info' && (
                                <>
                                <div className="font-bold text-[14px] mb-2">{eventData.eventTitle}</div>
                                <div>일시: {formatDateTimeWithDay(eventData.eventEndTime)}</div>
                                <div>장소: {eventData.locationInfo}</div>
                                <div>대상: {eventData.target}</div>
                                <div>수량: {eventData.quantity}</div>
                                <div>티켓팅 가능 시간: {formatDateTimeWithDay(eventData.eventTime)}</div>
                                <div className='text-black/50 self-center mt-[18px]'>{eventData.description}</div>
                                <a href={eventData.promotionLink} className='text-[#0D99FF] mt-[18px]'>학생회 간식나눔 홍보글 링크</a>
                                <div className='self-end text-[#AEAEAE]'>문의: {eventData.inquiryNumber}</div>
                                </>
                            )}

                            {isSelected === 'note' && (
                                <>
                                <div className="font-bold text-[13px] ">예매 안내</div>
                                <div>  • <span className='text-[#0D99FF]'>1인 1매</span>만 예매 가능합니다. <br/>
                                       • 반드시 <span className='text-[#0D99FF]'>본인의 학과·학번</span>으로 예매해야 하며, 수령 시 학생증으로 본인 여부를 확인합니다. <span className='text-[#eb2e2e]'>(학생증 미지참 시 수령 불가) </span><br/>
                                       • 티켓은 한정 수량으로, 소진 시 조기 마감될 수 있습니다.
                                </div>
                                <div className="font-bold text-[13px] mt-1">수령 안내</div>
                                <div>  
                                       • 티켓팅 성공 시 발급된 <span className='text-[#0D99FF]'>간식나눔 교환권과 학생증</span>을 제시해야 수령 가능합니다.  <br/>
                                       • <span className='text-[#0D99FF]'>간식나눔 시작 후 ○분 내</span> 미수령 시, 해당 티켓은 자동 취소되고 현장 배부로 전환됩니다.
                                </div>
                                <div className="font-bold text-[13px] mt-1">양도·거래 금지</div>
                                <div>  
                                       • 티켓의 <span className='text-[#0D99FF]'>양도, 판매, 거래를 금지</span>하며, 적발 시 판매자와 구매자 모두 수령 불가 처리됩니다.
                                </div>
                                <div className="font-bold text-[13px] mt-1">취소 안내</div>
                                <div>  
                                       • 티켓팅 마감시간까지 자유롭게 취소할 수 있습니다.  <br/>
                                       • 취소는 <span className='text-[#0D99FF]'>[마이페이지 → 간식나눔 → 티켓팅 내역]</span>에서 진행할 수 있습니다. <br/>
                                       • 기재된 시간 내 미수령 시, 자동으로 취소됩니다.
                                       
                                </div>
                                <div className="font-bold text-[13px] mt-1">문의</div>
                                <div>  
                                       • 서비스 이용 문의: <a href='https://www.instagram.com/codin_inu?igsh=bnZ0YmhjaWxtMXp4' className='underline text-[#0D99FF]'>CodIN 인스타그램 </a> DM <br/>
                                       • 간식나눔 관련 문의: 주관처(학생회)
                                </div>
                                <div className=' text-[#AEAEAE] text-center mt-2'>온라인 문의 시 고객님의 학과와 학번, 성함을 남겨주시면 <br/> 더 빠른 처리가 가능합니다.</div>
                                
                                </>
                            )}
                          
                        </div>
                    </div>
                )}

                {/* 하단 버튼 */}
                {eventData && (
                    <div className="fixed bottom-0 left-0 w-full px-4 bg-white pb-[35px] flex justify-center">
                        {ticketStatus === 'available' && (
                            <button className="w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]" onClick={handleTicketClick}>
                                티켓팅하기
                            </button>
                        )}

                        {ticketStatus === 'upcoming' && (
                            <button className="w-full h-[50px] border border-[#0D99FF] text-[#0D99FF] bg-white rounded-[5px] text-[18px] font-bold flex items-center justify-center gap-2 max-w-[500px]">
                                <img src='/icons/alert.svg' alt="alert" /> 오픈 전 알림 받기
                            </button>
                        )}

                        {ticketStatus === 'countdown' && (
                            <button className="w-full h-[50px] border border-[#0D99FF] text-[#0D99FF] bg-[#EBF0F7] rounded-[5px] text-[18px] font-bold flex items-center justify-center gap-2 max-w-[500px]">
                                <img src='/icons/timer.svg' alt="timer" /> <span>{remainingTime}</span>
                            </button>
                        )}

                        {ticketStatus === 'closed' && (
                            <button className="w-full h-[50px] bg-[#A6A6AB] text-[#808080] rounded-[5px] text-[18px] font-bold max-w-[500px]" disabled>
                                티켓팅 마감
                            </button>
                        )}
                    </div>
                )}
            </DefaultBody>
        </Suspense>
    );
}
