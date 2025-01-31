"use client";

import { FC, Suspense } from "react";
import { roomItemDetailProps } from "./interfaces/roomItemDetail_interface";


const RoomItemDetail: React.FC<roomItemDetailProps> = ({ isActive, lecture }) => {

    return (
        isActive && lecture &&(
        <div className="absolute py-[6px] px-[12px] bg-[#FFFFFF] 
                        bottom-[24px] rounded-[15px] shadow-[0_0_10px_0_rgba(0,_0,_0,_0.25)] 
                        transform -translate-x-1/2
                        font-regular text-[12px] text-[#212121]">
            <p className="font-medium whitespace-nowrap">{lecture.lectureNm} {lecture.professor}</p>
            <p className="text-[#808080] whitespace-nowrap">{lecture.startTime} ~ {lecture.endTime}</p>
        </div>
        )
    
    );
};

export default RoomItemDetail;