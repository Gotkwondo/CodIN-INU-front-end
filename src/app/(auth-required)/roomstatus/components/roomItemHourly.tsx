// ../components/roomItem.tsx
'use client';

import React from 'react';
import { roomItemProps } from '../interfaces/roomItem_interface';
import { Lecture } from '../interfaces/page_interface';
import { TIMETABLE_GAP } from '../constants/timeTableData';

// 09:00 ~ 18:00
const BASE_HOUR = 9;
const HOURS_COUNT = 9;
const START_MIN = BASE_HOUR * 60;

const COLORS = {
  m0: '#EBF0F7', // 0
  m15: '#C3E6FF', // 15
  m30: '#92D1FF', // 30
  m45: '#3CADFF', // 45
  m60: '#0D99FF', // 60
} as const;

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function fmt(mins: number) {
  const h = Math.floor(mins / 60);
  const mm = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
function colorFor(mins: number) {
  if (mins >= 60) return COLORS.m60;
  if (mins >= 45) return COLORS.m45;
  if (mins >= 30) return COLORS.m30;
  if (mins >= 15) return COLORS.m15;
  return COLORS.m0;
}

type HourInfo = {
  totalFilledMin: number; // 0~60 (겹침 합산, 상한 60)
  dominant?: Lecture | null; // 해당 시간칸에서 가장 오래 차지한 강의
  dispStartMin: number; // 팝업 표시 시작(칸 내부로 clamp)
  dispEndMin: number; // 팝업 표시 끝(칸 내부로 clamp)
};

function buildHourInfos(lectures: Lecture[]): HourInfo[] {
  const infos: HourInfo[] = [];
  for (let i = 0; i < HOURS_COUNT; i++) {
    const hourStart = START_MIN + i * 60;
    const hourEnd = hourStart + 60;

    let total = 0;
    let best: { lec: Lecture; mins: number; s: number; e: number } | null =
      null;

    for (const lt of lectures ?? []) {
      const s = Math.max(hourStart, toMin(lt.startTime));
      const e = Math.min(hourEnd, toMin(lt.endTime));
      const mins = Math.max(0, e - s);
      if (mins > 0) {
        total += mins;
        if (!best || mins > best.mins) best = { lec: lt, mins, s, e };
      }
    }

    infos.push({
      totalFilledMin: Math.min(60, total),
      dominant: best?.lec ?? null,
      dispStartMin: best ? best.s : hourStart,
      dispEndMin: best ? best.e : hourEnd,
    });
  }
  return infos;
}

const RoomItemHourly: React.FC<roomItemProps> = ({
  RoomName,
  LectureList,
  // 아래 두 props는 시그니처 유지용. (시간 1칸 전환 후 내부에선 사용하지 않음)
  RoomStatusList: _ignoreA,
  BoundaryList: _ignoreB,
}) => {
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  const infos = React.useMemo(() => buildHourInfos(LectureList), [LectureList]);

  // 상단 라벨: 9 10 11 12 1 2 3 4 5
  const labels = [9, 10, 11, 12, 1, 2, 3, 4, 5];

  const open = (i: number) => setActiveIdx(i);
  const close = () => setActiveIdx(null);

  return (
    <div
      id="scrollbar-hidden"
      className="flex flex-col gap-[12px]"
    >
      <h3 className="absolute top-[17px] left-[14px] text-[#212121] text-[14px] w-max bg-white z-30 font-medium">
        {RoomName}
      </h3>

      <div className="mt-[29px]">
        <div className="flex w-full gap-[2px] mb-[6px]">
          {labels.map(n => (
            <p
              key={n}
              className="flex-1 shrink-0 text-[#808080] text-[12px]"
            >
              {n}
            </p>
          ))}
        </div>

        <div
          style={{ gap: TIMETABLE_GAP }}
          className="flex w-full gap-[2px] flex-nowrap"
        >
          {infos.map((info, idx) => {
            const hourStart = START_MIN + idx * 60;
            const hourEnd = hourStart + 60;
            const bg = colorFor(info.totalFilledMin);

            const isEmpty = info.totalFilledMin === 0;
            const title = isEmpty
              ? `빈 강의실 · ${fmt(hourStart)}~${fmt(hourEnd)}`
              : `${info.dominant?.lectureNm ?? ''} · ${fmt(
                  info.dispStartMin
                )}~${fmt(info.dispEndMin)}`;

            return (
              <button
                key={idx}
                id={`room-${RoomName}-hour-${idx}`}
                onClick={() => open(idx)}
                onTouchStart={() => open(idx)}
                onMouseLeave={close}
                style={{
                  backgroundColor: bg,
                }}
                className="relative shrink-0 h-[34px] flex-1 rounded-[5px]"
                title={title}
              >
                {/* 회색 팝업 (absolute, top:-126px) */}
                {activeIdx === idx && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-[10px] text-white px-[26px] pt-[9px] pb-[12px] text-left z-30"
                    style={{
                      top: '-84px',
                      backgroundColor: 'rgba(17, 17, 17, 0.64)',
                      backdropFilter: 'blur(2px)',
                      minWidth: '100px',
                    }}
                  >
                    <p className="text-[10px] font-bold">
                      {isEmpty ? '빈 강의실' : info.dominant?.lectureNm}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {/* Point: 해당 시간칸과 동일 색 */}
                      <span
                        className="inline-block w-[6px] h-[6px] rounded-full"
                        style={{ backgroundColor: bg }}
                        aria-hidden
                      />
                      <span className="text-[10px]">
                        {isEmpty
                          ? `${fmt(hourStart)}~${fmt(hourEnd)}`
                          : `${fmt(info.dispStartMin)}~${fmt(info.dispEndMin)}`}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomItemHourly;
