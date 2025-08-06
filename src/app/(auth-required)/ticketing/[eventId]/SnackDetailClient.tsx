'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import UserInfoModal from '@/components/modals/UserInfoModal';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { SnackDetailClientProps } from '@/interfaces/SnackEvent';

export default function SnackDetailClient({ event }: SnackDetailClientProps) {
  const router = useRouter();
  const [isInfo, setIsInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<'available' | 'upcoming' | 'countdown' | 'closed'>('closed');
  const [remainingTime, setRemainingTime] = useState('00:51');

  useEffect(() => {
    if (!isInfo) setShowModal(true);
  }, [isInfo]);

  useEffect(() => {
    const updateTicketStatus = () => {
      const ticketDate = new Date(event.eventTime);
      const now = new Date();
      const diffMs = ticketDate.getTime() - now.getTime();
      const diffSec = Math.floor(diffMs / 1000);

      if (diffSec <= 0) {
        setTicketStatus('available');
        setRemainingTime('00:00');
      } else if (diffSec <= 180) {
        setTicketStatus('countdown');
        const min = String(Math.floor(diffSec / 60)).padStart(2, '0');
        const sec = String(diffSec % 60).padStart(2, '0');
        setRemainingTime(`${min}:${sec}`);
      } else {
        setTicketStatus('upcoming');
      }
    };

    updateTicketStatus();
    const interval = setInterval(updateTicketStatus, 1000);
    return () => clearInterval(interval);
  }, [event.eventTime]);

  const handleTicketClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/ticketing/ticket');
    }, 2000);
  };

  return (
    <>
      <Header>
        <Header.BackButton onClick={() => router.back()} />
        <Header.Title>간식나눔</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        {showModal && <UserInfoModal onClose={() => setShowModal(false)} />}
        {isLoading && <LoadingOverlay />}

        <div className="flex flex-col items-center gap-4">
          <div className='w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)]'> 
            <img src={event.eventImageUrls} alt="간식 이미지" />
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center">
              <div className="flex flex-row items-start font-semibold text-[18px]">잔여 수량<span className="text-[#0D99FF] ml-1 mt-[-10px]">•</span></div>
              <div className="text-[#0D99FF] font-semibold text-[18px]">{event.currentQuantity}개</div>
            </div>
            <div className="text-[12px] text-black mt-1">실시간으로 업데이트 됩니다.</div>
          </div>

          <div className='w-full border border-t-1 border-[#D4D4D4]'></div>

          <div className='border-t-1 border-[#D4D4D4] flex justify-start flex-col items-center'>
            <div className="text-sm text-black mt-2 text-center font-medium leading-[17px]">
              {isInfo ? '수령자 정보를 이미 입력했어요.' : <>빠른 티켓팅을 위해 수령자 <br /> 정보를 먼저 입력해주세요.</>}
            </div>
            <button className="mt-3 text-white text-[12px] px-[22px] py-[6px] gap-[10px] bg-[#0D99FF] rounded-[20px]" onClick={() => setShowModal(true)}>
              {isInfo ? '수령자 정보 수정' : '수령자 정보 입력'}
            </button>
          </div>

          <div className='w-full flex flex-row justify-end text-[11px] leading-[13px] text-center font-medium text-[#0D99FF] gap-3 underline underline-offset-2'>
            <button>상세정보</button>
            <button>유의사항</button>
          </div>

          <div className="flex flex-col w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] p-4 text-[12px] font-normal text-black gap-y-1">
            <div className="font-bold text-[14px] mb-2">{event.eventTitle}</div>
            <div>일시: {event.eventTime}</div>
            <div>장소: {event.locationInfo}</div>
            <div>대상: {event.target}</div>
            <div>수량: {event.quantity}개</div>
            <div className='text-black/50 self-center mt-[18px]'>{event.description}</div>
            <div className='self-end text-[#AEAEAE]'>문의: 010-0000-0000</div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full px-4 bg-white pb-[35px] flex justify-center">
          {ticketStatus === 'available' && (
            <button className="mt-3 w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]" onClick={handleTicketClick}>
              티켓팅하기
            </button>
          )}
          {ticketStatus === 'upcoming' && (
            <button className="mt-3 w-full h-[50px] border border-[#0D99FF] text-[#0D99FF] bg-white rounded-[5px] text-[18px] font-bold flex items-center justify-center gap-2 max-w-[500px]">
              <img src='/icons/alert.svg' className='flex' /> 오픈 전 알림 받기
            </button>
          )}
          {ticketStatus === 'countdown' && (
            <button className="mt-3 w-full h-[50px] border border-[#0D99FF] text-[#0D99FF] bg-[#EBF0F7] rounded-[5px] text-[18px] font-bold flex items-center justify-center gap-2 max-w-[500px]">
              <img src='/icons/timer.svg' /> <span>{remainingTime}</span>
            </button>
          )}
          {ticketStatus === 'closed' && (
            <button className="mt-3 w-full h-[50px] bg-[#A6A6AB] text-[#808080] rounded-[5px] text-[18px] font-bold max-w-[500px]" disabled>
              티켓팅 마감
            </button>
          )}
        </div>
      </DefaultBody>
    </>
  );
}