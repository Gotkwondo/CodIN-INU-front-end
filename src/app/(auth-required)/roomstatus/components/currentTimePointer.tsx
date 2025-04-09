"use client";

import React, { useEffect, useState } from "react";

const CurrentTimePointer: React.FC<{
        minHour:number, maxHour:number, 
        widthOfBlock: number, gapBetweenBlocks: number,
        numOfBlocks: number,
        refOfParent: React.RefObject<HTMLDivElement>, 
    }> = ({minHour, maxHour, widthOfBlock, gapBetweenBlocks, numOfBlocks, refOfParent}) => {
    
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentTimeText, setCurrentTimeText] = useState("오후 9:00");

    const [pointerHeight, setPointerHeight] = useState(0);

    const [showNav, setShowNav] = useState(null);
    const currentTimeRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateDate = () => { 
            const date = new Date();
            date.setHours(16);
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
      
    
    const getMarginLeft = () => {        
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const totalMinutes = (currentHour - minHour) * 60 + currentMinute;
        const totalWidth = numOfBlocks * (widthOfBlock + gapBetweenBlocks);
        const marginLeft = (totalWidth / ((maxHour - minHour) * 60)) * totalMinutes;
        return Math.floor(marginLeft);

    }
    
    const getCurrentTimeText = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours < 12 ? '오전' : '오후';
        const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinute = minutes.toString().padStart(2, '0');
        return `${period} ${formattedHour}:${formattedMinute}`;
    };
    
    const scrollToNow = ( direction: number ) => {
        if( currentTime.getHours() < minHour || currentTime.getHours() >= maxHour){
            console.log(minHour,currentTime.getHours(),maxHour );
            refOfParent.current?.scrollTo({ left: 0, behavior: "smooth" });
        } else if (!direction){
            refOfParent.current?.scrollTo({ left: getMarginLeft() - window.innerWidth/2, behavior: "smooth" });
        } else{
            refOfParent.current?.scrollTo({ left: getMarginLeft() + window.innerWidth/2, behavior: "smooth" });
        }
    }

    
    if( currentTime.getHours() < maxHour-2 ){ //오후 4시 이전 , 글자가 오른쪽에 보임
        return(
            <>
                { showNav === "left" && <button onClick={()=>{scrollToNow(0);}} className="fixed top-[159px] left-[18px] top- text-[#FFB300] text-sm"><span className="text-sr text-[#FFB300] ml-[2px]">◀</span> 현재 시간</button> }
                { showNav === "right" && <button onClick={()=>{scrollToNow(1);}} className="fixed top-[159px] right-[18px] top- text-[#FFB300] text-sm">현재 시간 <span className="text-sr text-[#FFB300] ml-[2px]">▶</span> </button> }
                <div ref={currentTimeRef} className="flex flex-col gap-[8px] w-max" style={{ transform: `translateX(${getMarginLeft()}px)` }}>
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
    }else if( currentTime.getHours() < maxHour ){ //오후 4시 ~ 오후 6시, 글자가 왼쪽에 보임
        return(
            <>
                { showNav === "left" && <button onClick={()=>{scrollToNow(0);}} className="fixed top-[159px] left-[18px] top- text-[#FFB300] text-sm"><span className="text-sr text-[#FFB300] ml-[2px]">◀</span> 현재 시간</button> }
                { showNav === "right" && <button onClick={()=>{scrollToNow(1);}} className="fixed top-[159px] right-[18px] top- text-[#FFB300] text-sm">현재 시간 <span className="text-sr text-[#FFB300] ml-[2px]">▶</span> </button> }
                <div ref={currentTimeRef} className="flex flex-col gap-[8px] w-max" style={{ transform: `translateX(${getMarginLeft()-77}px)` }}>
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
                { showNav === "left" && <button onClick={()=>{scrollToNow(0);}} className="fixed top-[159px] left-[18px] top- text-[#FFB300] text-sm"><span className="text-sr text-[#FFB300] ml-[2px]">◀</span> 현재 시간</button> }
                { showNav === "right" && <button onClick={()=>{scrollToNow(1);}} className="fixed top-[159px] right-[18px] top- text-[#FFB300] text-sm">현재 시간 <span className="text-sr text-[#FFB300] ml-[2px]">▶</span> </button> }
                <div ref={currentTimeRef} className="flex flex-col gap-[8px] w-max opacity-50">
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