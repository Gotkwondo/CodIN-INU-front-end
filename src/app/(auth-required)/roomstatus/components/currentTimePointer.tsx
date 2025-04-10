"use client";

import React, { useEffect, useState } from "react";
import { CurrentTimePointerProps } from "../interfaces/currentTimePointer_interface";
import { getMarginLeft } from "../utils/timePointerUtils";

const CurrentTimePointer: React.FC<CurrentTimePointerProps> = ({minHour, maxHour, refOfParent, setShowNav}) => {
    
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentTimeText, setCurrentTimeText] = useState("오후 9:00");

    const [pointerHeight, setPointerHeight] = useState(0);

    const currentTimeRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateDate = () => { 
            const date = new Date();
            setCurrentTime(date); 
            setCurrentTimeText(getCurrentTimeText(date));

            setTimeout(() => {//showNav를 위한 계산
                window.dispatchEvent(new Event("resize"));
            }, 0);
        };
        updateDate(); 

        //1분마다 현재 시간 업데이트
        const setTimeinterval = setInterval(updateDate, 60000); 
        return () => clearInterval(setTimeinterval);

    }, []);

    useEffect(() => {
        const ro = new ResizeObserver(()=>{
            setPointerHeight(refOfParent.current?.clientHeight || 0);
        })
        ro.observe(refOfParent.current);

    },[]);

    useEffect(() => {
        const handleScroll = () => {
          const rect = currentTimeRef.current?.getBoundingClientRect();
          if (!rect) return;

          if (rect.left < -77) {
            setShowNav("left");
          } else if (rect.right > window.innerWidth+77) {
            setShowNav("right");
          } else {
            setShowNav(null);
          }
        };
        

        const scrollParent = refOfParent.current;
        scrollParent?.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        return () => {
          scrollParent?.removeEventListener("scroll", handleScroll);
          window.removeEventListener("resize", handleScroll);
        };
      }, []);


    const getCurrentTimeText = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours < 12 ? '오전' : '오후';
        const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinute = minutes.toString().padStart(2, '0');
        return `${period} ${formattedHour}:${formattedMinute}`;
    };
    
    if( minHour <= currentTime.getHours() && currentTime.getHours() < maxHour-2 ){ //오후 4시 이전 , 글자가 오른쪽에 보임
        return(
            <>
                <div ref={currentTimeRef} className="flex flex-col gap-[4px] w-max" style={{ transform: `translateX(${getMarginLeft()}px)` }}>
                    <span className="text-sm text-[#FFB300]">
                        <span className="text-sr text-[#FFB300] mr-[8px]">▼</span> 
                        {currentTimeText}
                    </span>
                    <div>
                        <div style={{ height: `${pointerHeight}px`}} className="absolute min-w-[1px] ml-[5px] h-full z-20 background bg-[#FFB300]"/>
                    </div>
                </div>
            </>
        );
    }else if( minHour <= currentTime.getHours() && currentTime.getHours() < maxHour ){ //오후 4시 ~ 오후 6시, 글자가 왼쪽에 보임
        return(
            <>
                <div ref={currentTimeRef} className="flex flex-col gap-[4px] w-max" style={{ transform: `translateX(${getMarginLeft()-77}px)` }}>
                    <span className="text-sm text-[#FFB300] ml-[11px]">
                        {currentTimeText}
                        <span className="text-sr text-[#FFB300] ml-[8px]">▼</span> 
                    </span>
                </div>
                <div className="flex flex-col gap-[8px] w-max" style={{ transform: `translateX(${getMarginLeft()}px)` }}>
                    <div>
                        <div style={{ height: `${pointerHeight}px`}} className="absolute min-w-[1px] ml-[5px] h-full z-20 background bg-[#FFB300]"/>
                    </div>
                </div>
            </>
        );
    }else{ //그 외 시간, 글자가 맨 왼쪽에 보임
        return(
            <>
                <div ref={currentTimeRef} className="flex flex-col gap-[4px] w-max opacity-50" >
                    <span className="text-sm text-[#FFB300] mb-[8px]">
                        <span className="text-sr text-[#FFB300] mr-[8px]">▼</span> 
                        {currentTimeText}
                    </span>
                </div>
            </>
        );
    }
    
};

export default CurrentTimePointer;