"use client";

import { FC, useState, useEffect, useRef } from "react";
import axios from "axios";
import BottomNav from "@/components/Layout/BottomNav";
import { Suspense } from 'react'
import Header from "@/components/Layout/header/Header";
import SmRoundedBtn from "@/components/buttons/smRoundedBtn";
import RoomItem from "./roomItem";
import { LectureDict } from "./interface/page_interface";

const RoomStatus: FC = () => {

    const [accessToken, setAccessToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [floor, setFloor] = useState<number>(1);
    const [roomStatus, setRoomStatus] = useState<LectureDict[]>([null,null,null,null,null]);

    useEffect(() => {
        const atk = localStorage.getItem("accessToken");
        if (atk) {
            setAccessToken(atk);
        }else{
            setError("로그인이 필요합니다.");
        }
    }, []);

    useEffect(() => {

        if(!accessToken){return;}
        //로그인 안되어 있으면 실행 안함

        const date = new Date();
        const day = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

        if(localStorage.getItem("roomStatusUpdatedAt") === day){
            if(roomStatus[0] === null){
                const rs = JSON.parse(localStorage.getItem("roomStatus"));
                setRoomStatus(rs);
            }
            return;
        };
        //오늘 강의실 정보 가져온 적 있으면, localstorage에서 꺼내 씀

        const getRoomStatus = async (floor: number) => {

            setIsLoading(true);

            try{
                const response = await axios.get(`https://www.codin.co.kr/api/rooms/empty`, {
                    headers: {
                        Authorization: accessToken,
                    },
                    params: {
                        floor: floor,
                    }
                });
                const la:LectureDict = response.data.data;
                let newrs = roomStatus; newrs[floor-1]=la;
                localStorage.setItem("roomStatus", JSON.stringify(newrs));
                localStorage.setItem("roomStatusUpdatedAt", day);
                setRoomStatus(newrs);
            }catch(err){
                setError(err.message);
            }finally {
                setIsLoading(false);
            }

        };

        for (let i = 1; i <= 5; i++ ) getRoomStatus(i);

    }, [accessToken]);

    if (isLoading){
        return(
            <Suspense>
                <div className={"w-full h-full"}>
                    <Header>
                        <Header.BackButton />
                        <Header.Title>강의실 현황</Header.Title>
                    </Header>
                    <div className="mt-[132px] px-0 flex justify-center"><p>강의실 정보를 불러오는 중이에요...</p></div>
                    <BottomNav activeIndex={1} />
                </div>
            </Suspense>
        )
    }

    if (error){
        return(
            <Suspense>
                <div className={"w-full h-full"}>
                    <Header>
                        <Header.BackButton />
                        <Header.Title>강의실 현황</Header.Title>
                    </Header>
                    <div className="mt-[132px] px-0 flex justify-center"><p>{error}</p></div>
                    <BottomNav activeIndex={1} />
                </div>
            </Suspense>
        )
    }

    return (
        <Suspense>
        <div className={"w-full h-full"}>

            <Header>
                <Header.BackButton />
                <Header.Title>강의실 현황</Header.Title>
            </Header>

            <div className="mt-[108px] px-0">

                <div className="flex w-full justify-center gap-[7px]">
                    <SmRoundedBtn text="1층" status={floor===1 ? 1: 0} onClick={()=>{ if(floor!==1) setFloor(1) }} />
                    <SmRoundedBtn text="2층" status={floor===2 ? 1: 0} onClick={()=>{ if(floor!==2) setFloor(2) }} />
                    <SmRoundedBtn text="3층" status={floor===3 ? 1: 0} onClick={()=>{ if(floor!==3) setFloor(3) }} />
                    <SmRoundedBtn text="4층" status={floor===4 ? 1: 0} onClick={()=>{ if(floor!==4) setFloor(4) }} />
                    <SmRoundedBtn text="5층" status={floor===5 ? 1: 0} onClick={()=>{ if(floor!==5) setFloor(5) }} />
                </div>
                
                {
                    roomStatus[floor-1] &&
                    Object.entries(roomStatus[floor-1]).map(([roomNum, status]) => {
                        return (
                            <div key={roomNum} className="flex flex-col mx-[20px] my-[24px] gap-[48px]">
                                <RoomItem RoomName={roomNum+"호"} RoomStatusList={Array.from({ length: 36 }, () => 0)} />
                            </div>
                        );
                    })
                }
                {/*<div className="flex flex-col mx-[20px] my-[24px] gap-[48px]">
                    <RoomItem RoomName="101호" RoomStatusList={Array.from({ length: 36 }, () => 0)} />
                </div>

                <div className="flex flex-col mx-[20px] my-[24px] gap-[48px]">
                    <RoomItem RoomName="102호" RoomStatusList={Array.from({ length: 36 }, () => 0)} />
                </div>

                <div className="flex flex-col mx-[20px] my-[24px] gap-[48px]">
                    <RoomItem RoomName="103호" RoomStatusList={Array.from({ length: 36 }, () => 0)} />
                </div> */}
            </div>

            <BottomNav activeIndex={1} />

        </div>
        </Suspense>
    );
};

export default RoomStatus;
