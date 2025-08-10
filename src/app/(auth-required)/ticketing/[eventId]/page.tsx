'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import UserInfoModal from '@/components/modals/ticketing/UserInfoModal';
import { fetchClient } from '@/api/clients/fetchClient';
import { FetchSnackDetailResponse, TicketEvent } from '@/interfaces/SnackEvent';
import { formatDateTimeWithDay } from '@/utils/date';

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

                        <div className='w-full flex justify-end text-[11px] text-[#0D99FF] gap-3 underline'>
                            <button>상세정보</button>
                            <button>유의사항</button>
                        </div>

                        <div className="flex flex-col w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] p-4 text-[12px] text-black gap-y-1">
                            <div className="font-bold text-[14px] mb-2">{eventData.eventTitle}</div>
                            <div>일시: {formatDateTimeWithDay(eventData.eventEndTime)}</div>
                            <div>장소: {eventData.locationInfo}</div>
                            <div>대상: {eventData.target}</div>
                            <div>수량: {eventData.quantity}</div>
                            <div>티켓팅 가능 시간: {formatDateTimeWithDay(eventData.eventTime)}</div>
                            <div className='text-black/50 self-center mt-[18px]'>{eventData.description}</div>
                            <a href={eventData.promotionLink} className='text-[#0D99FF] mt-[18px]'>학생회 간식나눔 홍보글 링크</a>
                            <div className='self-end text-[#AEAEAE]'>문의: {eventData.inquiryNumber}</div>
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
