'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import UserInfoModal from '@/components/modals/UserInfoModal';

export default function SnackDetail() {
    const router = useRouter();

    const [isInfo, setIsInfo] = useState(false); // 수령자 정보 입력 여부
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [ticketStatus, setTicketStatus] = useState<'available' | 'upcoming' | 'countdown' | 'closed'>('closed');
    const [remainingTime, setRemainingTime] = useState('00:51');

    // isInfo가 false일 경우 모달 띄우기
    useEffect(() => {
        if (!isInfo) {
        setShowModal(true);
        }
    }, [isInfo]);

    const dummyData = {
        image: "/images/snack.svg", // 교체 가능
        quantity: "500개",
        title: "총장님과 함께하는 중간고사 간식나눔",
        date: "2025-07-22T18:43:00",
        location: "인천대학교 송도캠퍼스 17호관 앞",
        organizer: "인천대 재학생",
        ticketTime: "17:00",
        href:'https://www.instagram.com/',
        phone:'010-0000-0000'
    };


    useEffect(() => {
        const updateTicketStatus = () => {
            const ticketDate = new Date(dummyData.date); // dummyData.date 파싱
            const now = new Date();
            

            const diffMs = ticketDate.getTime() - now.getTime();
            const diffSec = Math.floor(diffMs / 1000);
            if (diffSec <= 0) {
            // 티켓팅 오픈됨
            setTicketStatus('available');
            setRemainingTime('00:00');
            } else if (diffSec <= 180) {
            // 오픈 3분 전 → countdown
            setTicketStatus('countdown');
            const min = String(Math.floor(diffSec / 60)).padStart(2, '0');
            const sec = String(diffSec % 60).padStart(2, '0');
            setRemainingTime(`${min}:${sec}`);
            } else {
            // 오픈 전 알림 상태
            setTicketStatus('upcoming');
            }
        };

        updateTicketStatus(); // 초기 실행

        // 카운트다운 업데이트용 interval
        const interval = setInterval(() => {
            updateTicketStatus();
        }, 1000);

        return () => clearInterval(interval);
        }, []);

        const handleTicketClick = () => {
            setIsLoading(true);
            setTimeout(() => {
                router.push('/ticketing/ticket');
            }, 2000); // 2초 후 이동 (로딩 시간)
        };

    return (
        <Suspense>
            <Header>
                <Header.BackButton onClick={() => router.back()} />
                <Header.Title>{`간식나눔`}</Header.Title>
            </Header>
            <DefaultBody hasHeader={1}>
                 {showModal && <UserInfoModal onClose={() => setShowModal(false)} />}
                 {isLoading && <LoadingOverlay />}
                <div className="flex flex-col items-center gap-4">
                    {/* 이미지 */}
                    <div className='w-full bg-white rounded-[15px] drop-shadow-lg'> 
                        <img src={dummyData.image} alt="간식 이미지" />
                    </div>
                   
                    {/* 잔여 수량 */}
                    <div className="w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-row items-start font-semibold text-[18px]">잔여 수량<span className="text-blue-500 ml-1 mt-[-10px]">•</span></div>
                            <div className="text-[#0D99FF] font-semibold text-[18px]">{dummyData.quantity}</div>
                        </div>
                        <div className="text-[12px] text-black mt-1">실시간으로 업데이트 됩니다.</div>
                    </div>

                    {/* 구분선 */}
                    <div className='w-full border border-t-1 border-[#D4D4D4]'></div>

                    {/* 수령자 정보 */}
                    <div className='border-t-1 border-[#D4D4D4] flex justify-start flex-col items-center'>
                        <div className="text-sm text-black mt-2 text-center font-medium leading-[17px]">
                            {isInfo ? (
                                    '수령자 정보를 이미 입력했어요.') : (
                                        <>
                                        빠른 티켓팅을 위해 수령자 <br /> 정보를 먼저 입력해주세요.
                                        </>
                                    )}
                        </div>
                        <button className="mt-3 text-white text-[12px] px-[22px] py-[6px] gap-[10px] bg-[#0D99FF] rounded-[20px]" onClick={()=>setShowModal(true)}> {isInfo?  '수령자 정보 수정': '수령자 정보 입력'} </button>
                    </div>

                    {/* 상세정보 유의사항 */}
                    <div className='w-full flex flex-row justify-end  text-[11px] leading-[13px] text-center font-medium text-[#0D99FF] gap-3 underline underline-offset-2'>
                        <button className=''>상세정보</button>
                        <button>유의사항</button>
                    </div>
                    {/* 간식 정보 카드 */}
                    <div className="flex flex-col w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] p-4 text-[12px]  font-normal text-black gap-y-1">
                        <div className="font-bold text-[14px] mb-2">{dummyData.title}</div>
                        <div className="">일시: {dummyData.date}</div>
                        <div className="">장소: {dummyData.location}</div>
                        <div className="">대상: {dummyData.organizer}</div>
                        <div className="">수량: {dummyData.quantity}</div>
                        <div className="">티켓팅 가능 시간: {dummyData.ticketTime}</div>

                        <div className='text-black/50 self-center mt-[18px]'>학생회 작성 설명</div>
                        <a href={dummyData.href} className='text-[#0D99FF] mt-[18px]'>학생회 간식나눔 홍보글 링크</a>

                        <div className='self-end text-[#AEAEAE]'>문의: {dummyData.phone}</div>
                       
                    </div>
                </div> 
                
                <div className="fixed bottom-0 left-0 w-full px-4 bg-white pb-[35px]">
                    {ticketStatus === 'available' && (
                    <button className="mt-3 w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold" onClick={handleTicketClick}>
                        티켓팅하기
                    </button>
                    )}

                    {ticketStatus === 'upcoming' && (
                    <button className="mt-3 w-full h-[50px] border border-[#0D99FF] text-[#0D99FF] bg-white rounded-[5px] text-[18px] font-bold flex items-center justify-center gap-2">
                        <img src='/icons/alert.svg' className='flex'></img> 오픈 전 알림 받기
                    </button>
                    )}

                    {ticketStatus === 'countdown' && (
                    <button className="mt-3 w-full h-[50px] border border-[#0D99FF] text-[#0D99FF] bg-[#EBF0F7] rounded-[5px] text-[18px] font-bold flex items-center justify-center gap-2">
                        <img src='/icons/timer.svg'></img> <span>{remainingTime}</span>
                    </button>
                    )}

                    {ticketStatus === 'closed' && (
                    <button
                        className="mt-3 w-full h-[50px] bg-[#A6A6AB] text-[#808080] rounded-[5px] text-[18px] font-bold"
                        disabled
                    >
                        티켓팅 마감
                    </button>
                    )}
                </div>
                {/* <BottomNav /> */}
                
            </DefaultBody>
        </Suspense>
    );
}