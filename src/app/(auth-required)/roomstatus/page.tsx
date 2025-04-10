"use client";

import { FC, useState, useEffect, useRef } from "react";
import apiClient from "@/api/clients/apiClient";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import { Suspense } from "react";
import Header from "@/components/Layout/header/Header";
import SmRoundedBtn from "@/components/buttons/smRoundedBtn";
import RoomItem from "./components/roomItem";
import CurrentTimePointer from "./components/currentTimePointer";
import { Lecture, LectureDict } from "./interfaces/page_interface";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import { MAXHOUR, MINHOUR, TIMETABLE_GAP, TIMETABLE_LENGTH, TIMETABLE_WIDTH } from "./constants/timeTableData";
import { getMarginLeft } from "./utils/timePointerUtils";

const RoomStatus: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [floor, setFloor] = useState<number>(1);
  const [roomStatus, setRoomStatus] = useState<LectureDict[]>([
    null,
    null,
    null,
    null,
    null,
  ]);

  //자식 요소에서 가져오는 props
  const [showNav, setShowNav] = useState(null);
  
  useEffect(() => {
    const date = new Date();
    const day = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (localStorage.getItem("roomStatusUpdatedAt") === day) {
      //오늘 강의실 정보 가져온 적 있으면, localstorage에서 꺼내 씀
      if (roomStatus[0] === null) {
        const rs = JSON.parse(localStorage.getItem("roomStatus"));
        console.log(rs);
        setRoomStatus(rs);
      }
      return;
    }

  const getRoomStatus = async () => {
    setIsLoading(true);
    apiClient
      .get("/rooms/empty")
      .then((response) => {
        const la: LectureDict[] = response.data.data;
        localStorage.setItem("roomStatus", JSON.stringify(la));
        localStorage.setItem("roomStatusUpdatedAt", day);
        setRoomStatus(la);
        console.log(la);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
    };

    getRoomStatus();
  
  }, []);

  if (isLoading) {
    return (
      <Suspense>
        <div className={"w-full h-full"}>
          <Header>
            <Header.BackButton />
            <Header.Title>강의실 현황</Header.Title>
          </Header>
          <div className="mt-[150px] px-0 flex justify-center">
            <p>강의실 정보를 불러오는 중이에요...</p>
          </div>
          <BottomNav activeIndex={1} />
        </div>
      </Suspense>
    );
  }

  if (error) {
    return (
      <Suspense>
        <div className={"w-full h-full"}>
          <Header>
            <Header.BackButton />
            <Header.Title>강의실 현황</Header.Title>
          </Header>
          <div className="mt-[132px] px-0 flex justify-center">
            <p>{error}</p>
          </div>
          <BottomNav activeIndex={1} />
        </div>
      </Suspense>
    );
  }

  const getTimeTableData = (listOfLecture: Lecture[]) => {
    let lecture: Lecture;
    let timeTable = Array.from({ length: TIMETABLE_LENGTH }, () => 0);
    let boundaryTable = Array.from({ length: TIMETABLE_LENGTH }, () => 0);
    for (lecture of listOfLecture) {
      const start = lecture.startTime;
      const end = lecture.endTime;

      const time = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
      const startPointer = time.indexOf(start.split(":")[0]);
      const endPointer = time.indexOf(end.split(":")[0]);

      const startMin = parseInt(start.split(":")[1]);
      const endMin = parseInt(end.split(":")[1]);

      let boundary = 0;
      if (startPointer >= 0 && endPointer < 10) {
        for (let i = startPointer; i <= endPointer; i++) {
          for (let j = 0; j <= 4; j++) {
            if (i > startPointer && i < endPointer) {
              timeTable[i * 4 + j] = 1;
            } else if (i === startPointer && j * 15 >= startMin) {
              if (boundary === 0) {
                boundaryTable[i * 4 + j] = 1;
                boundary = 1;
              }
              timeTable[i * 4 + j] = 1;
            } else if (i === endPointer && j * 15 <= endMin) {
              timeTable[i * 4 + j] = 1;
            } else {
              if (boundary === 1) {
                boundaryTable[i * 4 + j - 1] = 1;
                boundary = 0;
                break;
              }
            }
          }
        }
        if (boundary === 1) {
          boundaryTable[endPointer * 4 + 4] = 1;
        }
      }
    }

    return [timeTable, boundaryTable];
  };

  const scrollToNow = ( direction: number ) => {
      const currentTime = new Date();
      if( currentTime.getHours() < MINHOUR || currentTime.getHours() >= MAXHOUR){
          scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
      } else if (!direction){
          scrollRef.current?.scrollTo({ left: getMarginLeft() - window.innerWidth/2, behavior: "smooth" });
      } else{
          scrollRef.current?.scrollTo({ left: getMarginLeft() + window.innerWidth/2, behavior: "smooth" });
      }
  }

  return (
    <Suspense>
      <div className={"w-full h-full"}>
        <Header>
          <Header.BackButton />
          <Header.Title>강의실 현황</Header.Title>
        </Header>

        <DefaultBody hasHeader={1}>
          <div className="px-0 pt-[18px] flex flex-col">
            <div
              id="scrollbar-hidden"
              className="flex justify-start overflow-x-scroll gap-[7px]"
            >
              <SmRoundedBtn
                text="1층"
                status={floor === 1 ? 1 : 0}
                onClick={() => {
                  if (floor !== 1) setFloor(1); scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }}
              />
              <SmRoundedBtn
                text="2층"
                status={floor === 2 ? 1 : 0}
                onClick={() => {
                  if (floor !== 2) setFloor(2); scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }}
              />
              <SmRoundedBtn
                text="3층"
                status={floor === 3 ? 1 : 0}
                onClick={() => {
                  if (floor !== 3) setFloor(3); scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }}
              />
              <SmRoundedBtn
                text="4층"
                status={floor === 4 ? 1 : 0}
                onClick={() => {
                  if (floor !== 4) setFloor(4); scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }}
              />
              <SmRoundedBtn
                text="5층"
                status={floor === 5 ? 1 : 0}
                onClick={() => {
                  if (floor !== 5) setFloor(5); scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                }}
              />
            </div>

            <div className={"flex items-end w-full h-[24px] bg-[rgba(0,0,0,0)] z-40 relative " + (showNav === "left" ?  "justify-start" : "justify-end")}>
              { showNav === "left"  && <button onClick={()=>{scrollToNow(0);}} className="text-[#FFB300] text-sm z-40 translate-y-full"><span className="text-sr text-[#FFB300] ml-[2px]">◀</span> 현재 시간</button> }
              { showNav === "right" && <button onClick={()=>{scrollToNow(1);}} className="text-[#FFB300] text-sm z-40 translate-y-full">현재 시간 <span className="text-sr text-[#FFB300] ml-[2px]">▶</span> </button> }
            </div>

            <div 
              ref={scrollRef}
              id="scrollbar-hidden" 
              className="overflow-x-scroll relative overflow-y-visible" 
            >
              <CurrentTimePointer
                minHour={MINHOUR} maxHour={MAXHOUR}
                refOfParent={scrollRef} setShowNav={setShowNav}
              />

              {roomStatus[floor - 1] &&
                Object.entries(roomStatus[floor - 1]).map(([roomNum, status]) => {
                  const [timeTable, boundaryTable] = getTimeTableData(status);
                  return (
                    <div
                      key={roomNum}
                      className="flex flex-col gap-[58px] w-max mb-[24px]"
                    >
                      <RoomItem
                        RoomName={roomNum + "호"}
                        LectureList={status}
                        RoomStatusList={timeTable}
                        BoundaryList={boundaryTable}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </DefaultBody>

        <BottomNav activeIndex={1} />
      </div>
    </Suspense>
  );
};

export default RoomStatus;
