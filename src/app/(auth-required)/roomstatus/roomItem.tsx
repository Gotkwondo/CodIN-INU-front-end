"use client";

import React from "react";
import { roomItemProps } from "./interfaces/roomItem_interface";
import RoomItemDetail from "./roomItemDetail";
import { Lecture } from "./interfaces/page_interface";


const RoomItem: React.FC<roomItemProps> = ({ RoomName, LectureList, RoomStatusList, BoundaryList }) => {

    const [clicked, setClicked] = React.useState<number>(-1);
    const [activeIndexList, setActiveIndexList] = React.useState<number[]>(Array.from({ length: 36 }, () => 0));
    const [touchedLecture, setTouchedLecture] = React.useState<Lecture>(null);
    
    const highlightTouchedLecture = (idx: number) =>{
        if(idx >= 0){
            //수업의 경계를 택할 경우, 둘 중 이전 수업을 선택
            if ( BoundaryList[idx] === 1 ) idx = idx-1; 

            let st = 0;
            let end = 36;

            for(let i = idx ; i >= 0 ; i--){
                if(BoundaryList[i] === 1) { st = i; break; }
            }
            for(let i = idx ; i <= 36 ; i++){
                if(BoundaryList[i] === 1) { end = i; break; }
            }
            let nl = Array.from({ length: 36 }, () => 0);

            //강의중이 아닌 시간을 고를 경우, 수업이 아닌 부분만 선택되도록 설정
            if ( RoomStatusList[idx]===0) { [st, end] = [ (st===0) ? st : st+1, (end===36)? end: end-1] } else { }

            for (let i = st; i <= end; i++) {
                nl[i] = 1;
            }
            setActiveIndexList(nl);
        }else{
            const emptyList = Array.from({ length: 36 }, () => 0);
            setActiveIndexList(emptyList);
        }
    }
    const onClickTimeLine = (idx: number) =>{
        setClicked(idx);
        highlightTouchedLecture(idx);
    }
    return (
        <div className="flex flex-col gap-[12px]">

            <h3 className="text-[#212121] text-[14px] font-medium">{RoomName}</h3>

            <div className="time-table">
                <div className="flex w-full gap-[4px]">
                    {[9, 10, 11, 12, 1, 2, 3, 4, 5].map((number) => (
                        <p key={number} className="flex-1 text-[#808080] font-regular text-[12px]">
                            {number}
                        </p>
                    ))}
                </div>
                <div className="flex gap-[2px] ml-[3px] w-full flex-wrap">
                    {RoomStatusList.map((status, index) => (
                        <button
                            key={index}
                            id={`room-${RoomName}-time-${index}`}  
                            onTouchStart={()=>onClickTimeLine(index)}
                            onTouchEnd={()=>onClickTimeLine(-1)}
                            className={`relative flex-1 h-[12px] ${activeIndexList[index] ? 'bg-[#212121]' : status ? 'bg-[#0D99FF]' : 'bg-[#EBF0F7]'}`}
                        ><RoomItemDetail isActive={clicked === index}/></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomItem;
