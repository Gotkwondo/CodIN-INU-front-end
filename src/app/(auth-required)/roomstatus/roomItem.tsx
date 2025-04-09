"use client";

import React from "react";
import { roomItemProps } from "./interfaces/roomItem_interface";
import RoomItemDetail from "./roomItemDetail";
import { Lecture } from "./interfaces/page_interface";

import styles from './styles/roomItem.module.css';

const RoomItem: React.FC<roomItemProps> = ({ RoomName, LectureList, RoomStatusList, BoundaryList }) => {

    const [clicked, setClicked] = React.useState<number>(-1);
    const [activeIndexList, setActiveIndexList] = React.useState<number[]>(Array.from({ length: 36 }, () => 0));
    const [touchedLecture, setTouchedLecture] = React.useState<Lecture>(null);
    

    const createEmptyLecture = (st:string, et:string) => {
        const newLecture: Lecture = {
            lectureNm: "빈 강의실",   
            professor: "",   
            roomNum: 0,
            startTime: st,
            endTime: et,
        } 
        return newLecture;
    }

    const selectToucedLecture = (idx: number) =>{
        if(RoomStatusList[idx] === 1) {
            //강의중인 시간을 선택했을 때
            for ( let lt of LectureList ){
                const [st, et] = [lt.startTime , lt.endTime];
                const startPointer = (parseInt(st.split(":")[0])-9)*4+Math.floor(parseInt(st.split(":")[1])/15);
                const endPointer = (parseInt(et.split(":")[0])-9)*4+Math.ceil(parseInt(et.split(":")[1])/15);
                if(startPointer <= idx && idx <= endPointer) { setTouchedLecture(lt); return; }
            }
        }else{
            //강의중이 아닌 시간을 선택했을 때
            let emptyStartTime = "09:00";
            let emptyEndTime = "18:00";
            for ( let lt of LectureList ){
                const [st, et] = [lt.startTime , lt.endTime];
                const startPointer = (parseInt(st.split(":")[0])-9)*4 + Math.floor(parseInt(st.split(":")[1])/15);
            
                if(idx < startPointer) { 
                    emptyEndTime = emptyEndTime > st ? st : emptyEndTime;
                }else{
                    emptyStartTime = emptyStartTime < et ? et : emptyStartTime;
                }
                
            }
            setTouchedLecture(createEmptyLecture(emptyStartTime, emptyEndTime)); return;
        }

        setTouchedLecture(null); return;

    }

    const highlightTouchedLecture = (idx: number) =>{
        if(idx >= 0){
            let st = 0;
            let end = 36;

            for(let i = idx-1 ; i >= 0 ; i--){
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
        selectToucedLecture(idx);
    }

    const getIsActive = (idx: number) => {
        if ( idx == 5 && clicked <=5 && clicked != -1 ){
            return true;
        }else if ( idx == 28 && clicked >= 28 ){
            return true;
        }else{
            return ( 5 < idx && idx < 28 && clicked === idx ) ? true : false;
        }
    }

    return (
        <div className="flex flex-col gap-[12px]">

            <h3 className="text-[#212121] text-[16px] font-medium">{RoomName}</h3>

            <div className={styles.scrollHint}>
                <div className="flex w-full gap-[4px] mb-[6px]">
                    {[9, 10, 11, 12, 1, 2, 3, 4, 5].map((number) => (
                        <p key={number} className="flex-1 text-[#808080] font-regular text-[14px]">
                            {number}
                        </p>
                    ))}
                </div>
                <div className="flex gap-[2px] ml-[3px] flex-nowrap ">
                    {RoomStatusList.map((status, index) => (
                        <button
                            key={index}
                            id={`room-${RoomName}-time-${index}`}  
                            onTouchStart={()=>onClickTimeLine(index)}
                            onTouchEnd={()=>onClickTimeLine(-1)}
                            className={`relative w-[16px] shrink-0 h-[24px] rounded-[3px] ${activeIndexList[index] ? RoomStatusList[index] === 1 ? 'bg-[#17659c]' : 'bg-[#212121]' : status ? 'bg-[#0D99FF]' : 'bg-[#EBF0F7]'}`}
                        ><RoomItemDetail isActive={getIsActive(index)} lecture={touchedLecture} /></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomItem;
