"use client";

import React, { useEffect } from "react";
import '@/app/globals.css';
import { PostReissue } from "@/api/user/postReissue";
interface DefaultBodyProps {
    hasHeader : number; // 0:헤더 없음, 1:헤더 있음
    children?: React.ReactNode;
}

const DefaultBody: React.FC<DefaultBodyProps> = ({ hasHeader, children }) => {
    
    
    const pt = hasHeader? " pt-[80px]" : "";

    useEffect(()=>{
        const Postreissue = async (retryCount=0) => 
        
        { if (retryCount < 3) {
                console.log(`🔄 재시도 중... (${retryCount + 1}/2)`);
                
                try {
                    const res = await PostReissue(); // 토큰 재발급 요청
                    console.log(res);
                    
                   
                } catch (error) {
                    retryCount + 1;
                    
                }
            }
            else{
            console.error("❌ 토큰 재발급 실패");
                    
                }
      
          }
          Postreissue();
        }, [])



    return (
       
        <div 
            id="scrollbar-hidden"
            className={ "bg-white w-full flex flex-col px-[20px] mb-[110px] "+ pt }>
            {children}
        </div>
    );
};

export default DefaultBody;
