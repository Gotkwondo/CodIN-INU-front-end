'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';

export default function SnackDetail() {
    const router = useRouter();

    const dummyData = {
        image: "/images/snack.svg", // 교체 가능
        quantity: "500개",
        title: "총장님과 함께하는 중간고사 간식나눔",
        date: "2025.04.16 (수) 17:00",
        location: "인천대학교 송도캠퍼스 17호관 앞",
        organizer: "인천대 재학생",
        ticketTime: "17:00",
    };

    return (
        <Suspense>
            <Header>
                <Header.BackButton onClick={() => router.back()} />
                <Header.Title>{`간식나눔`}</Header.Title>
            </Header>
            <DefaultBody hasHeader={1}>
                <div className="flex flex-col items-center gap-4">
                    {/* 이미지 */}
                    <div className='w-full bg-white rounded-[15px] drop-shadow-lg'> 
                        <img src={dummyData.image} alt="간식 이미지" />
                    </div>
                   
                    {/* 잔여 수량 */}
                    <div className="w-full">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-[18px]">잔여 수량<span className="text-blue-500 ml-1 mt-[-40px]">•</span></div>
                            <div className="text-[#0D99FF] font-semibold text-[18px]">{dummyData.quantity}</div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">실시간으로 업데이트 됩니다.</div>
                    </div>

                    <div className='border-t-1 border-[#D4D4D4] flex justify-start flex-col items-center'>
                        <div className="text-sm text-gray-700 mt-2 text-center">빠른 티켓팅을 위해 수령자 <br/>  정보를 먼저 입력해주세요.</div>
                        <button className="mt-3 text-white text-[12px] px-[22px] py-[6px] gap-[10px] bg-[#0D99FF] rounded-[20px]">수령자 정보 입력</button>
                    </div>

                    {/* 간식 정보 카드 */}
                    <div className="w-full bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] p-4">
                        <div className="font-semibold text-base mb-2">{dummyData.title}</div>
                        <div className="text-sm text-gray-700">일시: {dummyData.date}</div>
                        <div className="text-sm text-gray-700">장소: {dummyData.location}</div>
                        <div className="text-sm text-gray-700">대상: {dummyData.organizer}</div>
                        <div className="text-sm text-gray-700">수량: {dummyData.quantity}</div>
                        <div className="text-sm text-gray-700">티켓팅 가능 시간: {dummyData.ticketTime}</div>
                       
                    </div>
                </div> 
                
                <button className="mt-3 w-full bg-[#0D99FF] text-white rounded py-2 text-sm font-semibold">티켓팅하기</button>
                <BottomNav />
            </DefaultBody>
        </Suspense>
    );
}