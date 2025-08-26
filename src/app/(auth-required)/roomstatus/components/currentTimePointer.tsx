'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CurrentTimePointerProps } from '../interfaces/currentTimePointer_interface';

const LINE_COLOR = '#FFB300';
const GAP = 6;

function formatKTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h < 12 ? '오전' : '오후';
  const hh = h % 12 === 0 ? 12 : h % 12;
  const mm = String(m).padStart(2, '0');
  return `${period} ${hh}:${mm}`;
}

const CurrentTimePointer: React.FC<CurrentTimePointerProps> = ({
  minHour,
  maxHour,
  width, // 전체(9칸) 폭
  height, // 부모에서 측정된 높이
  refOfParent,
  setShowNav,
}) => {
  const [now, setNow] = useState(new Date());
  const wrapRef = useRef<HTMLDivElement>(null);

  // 1분마다 현재 시간 갱신
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const hoursFloat = now.getHours() + now.getMinutes() / 60;
  const range = Math.max(1, maxHour - minHour); // 0 분모 방지
  const inRange = hoursFloat >= minHour && hoursFloat < maxHour;

  // X 위치(px): 범위 밖이면 좌(0) / 우(width)
  const x = useMemo(() => {
    if (!width) return 0;
    if (!inRange) return hoursFloat < minHour ? 0 : width;
    const ratio = (hoursFloat - minHour) / range; // 0~1
    return Math.max(0, Math.min(width, ratio * width));
  }, [hoursFloat, inRange, minHour, range, width]);

  const onLeftHalf = x < width / 2;
  const timeText = formatKTime(now);

  // 뷰포트 밖 네비 힌트
  useEffect(() => {
    const handle = () => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      if (r.right < 0) setShowNav?.('left');
      else if (r.left > window.innerWidth) setShowNav?.('right');
      else setShowNav?.(null);
    };
    const scroller: any = refOfParent?.current ?? window;
    scroller.addEventListener?.('scroll', handle);
    window.addEventListener('resize', handle);
    handle();
    return () => {
      scroller.removeEventListener?.('scroll', handle);
      window.removeEventListener('resize', handle);
    };
  }, [refOfParent, setShowNav]);

  if (!width || !height) return null;

  return (
    <div
      ref={wrapRef}
      className="absolute top-0 z-20"
      style={{ left: x }}
    >
      {/* 세로선: 범위 밖이어도 항상 표시 */}
      <div
        className="block absolute left-0"
        style={{ width: 1, height, background: LINE_COLOR }}
      />

      {/* 텍스트: 절반 기준 방향/형식 변경 */}
      {onLeftHalf ? (
        <div
          className="flex justify-between absolute w-[66px] -top-[24px] text-[12px] text-[#FFB300] select-none"
          style={{ left: GAP }} // 선 오른쪽
        >
          {/* 왼쪽: ▼ 오후 12:00 */}
          <span>▼</span>
          <span>{timeText}</span>
        </div>
      ) : (
        <div
          className="flex justify-between absolute w-[66px] -top-[24px] text-[12px] text-[#FFB300] select-none text-right"
          style={{ left: GAP, transform: 'translateX(-100%)' }} // 선 왼쪽
        >
          {/* 오른쪽: 오후 12:00 ▼ */}
          <span>{timeText}</span>
          <span>▼</span>
        </div>
      )}
    </div>
  );
};

export default CurrentTimePointer;
