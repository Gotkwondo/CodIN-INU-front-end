'use client';

import { FC, useState, useEffect, useRef } from 'react';
import apiClient from '@/api/clients/apiClient';
import SmRoundedBtn from '@/components/buttons/smRoundedBtn';
import RoomItem from '../components/roomItem';
import CurrentTimePointer from '../components/currentTimePointer';
import { Lecture, LectureDict } from '../interfaces/page_interface';
import {
  MAXHOUR,
  MINHOUR,
  TIMETABLE_GAP,
  TIMETABLE_LENGTH,
  TIMETABLE_WIDTH,
} from '../constants/timeTableData';
import { getMarginLeft } from '../utils/timePointerUtils';
import { useParams } from 'next/navigation';
import { set } from 'lodash';
import ShadowBox from '@/components/common/shadowBox';
import RoomItemHourly from '../components/roomItemHourly';
import {
  useElementSizeHeight,
  useElementSizeWidth,
} from '@/hooks/useElementSize';

export default function RoomStatus() {
  const params = useParams();
  const floorParam = params.floor;

  const { ref_w, width } = useElementSizeWidth<HTMLDivElement>();
  const { ref_h, height } = useElementSizeHeight<HTMLDivElement>();

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
    if (!floorParam) {
      setFloor(1);
    } else {
      setFloor(Number(floorParam));
    }
    const date = new Date();
    const day = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    if (localStorage.getItem('roomStatusUpdatedAt') === day) {
      //오늘 강의실 정보 가져온 적 있으면, localstorage에서 꺼내 씀
      if (roomStatus[0] === null) {
        const rs = JSON.parse(localStorage.getItem('roomStatus'));
        console.log(rs);
        setRoomStatus(rs);
      }
      return;
    }

    const getRoomStatus = async () => {
      setIsLoading(true);
      apiClient
        .get('/rooms/empty')
        .then(response => {
          const la: LectureDict[] = response.data.data;
          localStorage.setItem('roomStatus', JSON.stringify(la));
          localStorage.setItem('roomStatusUpdatedAt', day);
          setRoomStatus(la);
          console.log(la);
        })
        .catch(err => {
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
      <>
        <div className={'w-full h-full'}>
          <div className="mt-[150px] px-0 flex justify-center">
            <p>강의실 정보를 불러오는 중이에요...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className={'w-full h-full'}>
          <div className="mt-[132px] px-0 flex justify-center">
            <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  const getTimeTableData = (listOfLecture: Lecture[]) => {
    let lecture: Lecture;
    let timeTable = Array.from({ length: TIMETABLE_LENGTH }, () => 0);
    let boundaryTable = Array.from({ length: TIMETABLE_LENGTH }, () => 0);
    for (lecture of listOfLecture) {
      const start = lecture.startTime;
      const end = lecture.endTime;

      const time = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
      const startPointer = time.indexOf(start.split(':')[0]);
      const endPointer = time.indexOf(end.split(':')[0]);

      const startMin = parseInt(start.split(':')[1]);
      const endMin = parseInt(end.split(':')[1]);

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

  const scrollToNow = (direction: number) => {
    const currentTime = new Date();
    if (currentTime.getHours() < MINHOUR || currentTime.getHours() >= MAXHOUR) {
      scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (!direction) {
      scrollRef.current?.scrollTo({
        left: getMarginLeft() - window.innerWidth / 2,
        behavior: 'smooth',
      });
    } else {
      scrollRef.current?.scrollTo({
        left: getMarginLeft() + window.innerWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex flex-col mt-[32px]">
      <div
        ref={ref_w}
        className="mx-[7px]"
      />
      {/* <div
        className={
          'flex items-end w-full h-[32px] bg-[rgba(0,0,0,0)] z-40 relative ' +
          (showNav === 'left' ? 'justify-start' : 'justify-end')
        }
      >
        {showNav === 'left' && (
          <button
            onClick={() => {
              scrollToNow(0);
            }}
            className="text-[#FFB300] text-sm z-40 translate-y-full"
          >
            <span className="text-sr text-[#FFB300] ml-[2px]">◀</span> 현재 시간
          </button>
        )}
        {showNav === 'right' && (
          <button
            onClick={() => {
              scrollToNow(1);
            }}
            className="text-[#FFB300] text-sm z-40 translate-y-full"
          >
            현재 시간 <span className="text-sr text-[#FFB300] ml-[2px]">▶</span>{' '}
          </button>
        )}
      </div> */}

      <div
        ref={ref_h}
        id="scrollbar-hidden"
        className="relative flex flex-col gap-[21px]"
      >
        <CurrentTimePointer
          minHour={MINHOUR}
          maxHour={MAXHOUR}
          width={width}
          height={height}
          refOfParent={scrollRef}
          setShowNav={setShowNav}
        />

        {roomStatus[floor - 1] &&
          Object.entries(roomStatus[floor - 1]).map(([roomNum, status]) => {
            const [timeTable, boundaryTable] = getTimeTableData(status);
            return (
              <ShadowBox
                key={roomNum}
                className="flex flex-col w-full px-[14px] pt-[17px] pb-[20px]"
              >
                <RoomItemHourly
                  RoomName={roomNum + '호'}
                  LectureList={status}
                  RoomStatusList={timeTable}
                  BoundaryList={boundaryTable}
                />
              </ShadowBox>
            );
          })}
      </div>
    </div>
  );
}
