import dayjs from 'dayjs';
import { useState } from 'react';
dayjs.locale('en');

import LeftArrow from '@public/icons/arrow/arrow_left.svg';
import RightArrow from '@public/icons/arrow/arrow_right.svg';
import Calendar from '@public/icons/calendar.svg';
import ShadowBox from '@/components/common/shadowBox';
import CloseIcon from '@public/icons/button/x.svg';

export default function DateCalendar() {
  // 연도 변환 모달
  const [showYearModal, setShowYearModal] = useState(false);

  // 현재 날짜를 가져옵니다.
  const currentDate = dayjs();
  const currentYear = currentDate.year();

  // 200년 전의 연도를 계산합니다.
  const pastYear = currentDate.subtract(200, 'year').year();

  // 현재 연도와 200년 전까지의 연도를 배열에 담습니다.
  const years = [];
  for (let year = currentYear; year >= pastYear; year--) {
    years.push(String(year));
  }

  // 요일
  const dayOfTheWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // 날짜 상태관리
  const [today, setToday] = useState(dayjs());

  // 해당 달의 전체일수를 구함
  const daysInMonth = today.daysInMonth();

  // 이번 달의 1일에 대한 정보
  const firstDayOfMonth = dayjs(today).startOf('month').locale('en');

  // 1일부터 마지막 날까지 배열에 순차적으로 넣음
  interface DateWithStatus {
    date: dayjs.Dayjs;
    status: string[];
  }
  const dates: DateWithStatus[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs(firstDayOfMonth).add(i - 1, 'day');
    dates.push({ date: date, status: ['point'] });
  }

  // 공백 날
  // firstDayOfMonth.day() // 0 ~ 6 (일 ~ 토)
  const emptyDates = new Array(firstDayOfMonth.day()).fill(null);

  // 1일의 요일 만큼 앞에 빈 공백 넣어준다.
  const calenderData: Array<null | DateWithStatus> = [...emptyDates, ...dates];

  // 이전 달
  const onClickPastMonth = () => {
    setToday(dayjs(today).subtract(1, 'month'));
  };

  // 다음 달
  const onClickNextMonth = () => {
    setToday(dayjs(today).add(1, 'month'));
  };

  // 초기화 (이번 달로 이동함)
  const onClickResetBtn = () => {
    setToday(dayjs());
  };

  // 연도 선택(변경)
  const onClickChangeYear = year => {
    setToday(dayjs(today).set('year', year));
    showYearModalBtn();
  };

  // 날짜 선택(변경) (= input 값 변경)
  const onClickChangeDate = date => {
    // setToday(dayjs(today).set('date', date.date.date()));
    showDateCalendarModalBtn();
  };

  // 연도 모달 on, off
  const showYearModalBtn = () => {
    setShowYearModal(!showYearModal);
  };

  // DateCalendar 모달 on, off
  const showDateCalendarModalBtn = () => {
    setShowYearModal(false);
  };

  return (
    <ShadowBox>
      {/* Date Calendar */}
      <div className="z-[200]">
        {/* 달력 모달과 연도 선택 모달이 둘 다 켜진 경우, 구분을 위해 달력 모달에 배경색을 입힌다. */}
        <div className="pb-[16px]">
          {/* 달력의 헤더 */}
          <header>
            <div className="relative flex justify-between pt-[18px] pb-[15px] border-b border-[#D4D4D4] p-[9px]">
              {/* 이전 달로 변경 */}
              <div className="left-4">
                <div onClick={onClickPastMonth}>
                  <LeftArrow />
                </div>
              </div>
              {/* 연도 선택 버튼 */}
              <div
                onClick={showYearModalBtn}
                className="flex items-center cursor-pointer"
              >
                <Calendar />
                <span className="ml-[7px] text-[14px] text-active font-bold text-center leading-[15px]">
                  {today.format('MMMM YYYY')}
                </span>
              </div>
              {/* 다음 달로 변경 */}
              <div className="right-4">
                <div onClick={onClickNextMonth}>
                  <RightArrow />
                </div>
              </div>

              {/* 연도 변경 모달 */}
              {showYearModal && (
                <section className="absolute top-[55px] left-0 z-[201] bg-[#fff] border-[1px] w-[330px] h-[280px] p-6 rounded-[15px]">
                  <ul
                    id="scrollbar-hidden"
                    className="w-full h-[200px] flex flex-row flex-wrap overflow-y-scroll"
                  >
                    {years.map((year, index) => (
                      <li
                        key={index}
                        onClick={() => onClickChangeYear(year)}
                        className={`w-[25%] h-[30px] flex flex-row justify-center items-center text-lg text-gray-600 cursor-pointer
                        ${
                          year === today.format('YYYY')
                            ? 'bg-black text-white'
                            : 'hover:font-bold hover:bg-gray-200 hover:text-black '
                        }`}
                      >
                        {year}
                      </li>
                    ))}
                  </ul>

                  {/* 연도 모달 닫기 버튼 */}
                  <div
                    className="flex flex-row justify-end pt-2"
                    onClick={showYearModalBtn}
                  >
                    <CloseIcon />
                  </div>
                </section>
              )}
            </div>

            {/* 요일 */}
            <ul className="flex flex-row justify-around px-[3.5px] pt-[17px] pb-[4px] text-[12px] font-bold">
              {dayOfTheWeek.map((el, index) => (
                <li
                  key={index}
                  className={`cursor-default w-[14.28%] text-center ${
                    el === 'SUN'
                      ? 'text-[#FE908A]'
                      : el === 'SAT'
                      ? 'text-active'
                      : 'text-sub'
                  }`}
                >
                  {el}
                </li>
              ))}
            </ul>
          </header>

          {/* 날짜 표시 */}
          <main className="px-[3.5px]">
            <ul className="flex flex-row flex-wrap">
              {calenderData.map((date, index) => (
                <li
                  key={index}
                  className="w-[14.28%] mt-[11px] flex flex-col items-center"
                >
                  {date !== null && (
                    <>
                      <div
                        onClick={() => onClickChangeDate(date)}
                        className={`cursor-pointer flex justify-center items-center text-[10px] font-bold w-[25px] aspect-square rounded-full
                          ${
                            date.date.day() === 0
                              ? 'text-[#FE908A]'
                              : date.date.day() === 6
                              ? 'text-active'
                              : 'text-sub'
                          }
                          ${
                            date.date.format('YYYY-MM-DD') ===
                            dayjs().format('YYYY-MM-DD')
                              ? 'bg-main text-white'
                              : 'bg-sub text-sub hover:bg-gray'
                          }`}
                        // if SUN = #FE908A, if SAT = text-active, else text-sub
                      >
                        {date.date.format('D')}
                      </div>
                      <div className="mt-[5px] h-[6px]">
                        {date.status.length > 0 &&
                          date.status.map((v, i) => (
                            <div
                              key={i}
                              id={v}
                              className="h-[6px] aspect-square rounded-full"
                            ></div>
                          ))}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </main>

          {/* 모달 하단 부분 */}
          {/* <section className="flex flex-row justify-between items-center px-2">
            초기화 버튼
            <button
              type="button"
              onClick={onClickResetBtn}
              className="text-blue-500 hover:underline"
            >
              초기화
            </button>

            켈린더 모달 전체 닫기 버튼
            <BlackBtn
              type={'button'}
              onClick={showDateCalendarModalBtn}
              px={'4'}
              py={'2'}
              textSize={'sm'}
              text={'닫기'}
            />
          </section> */}
        </div>
      </div>

      {/* DateCalendar 모달 바깥 부분 */}
      <div
        className="fixed top-0 left-0 w-full h-full z-[199]"
        style={{
          display: showYearModal ? 'block' : 'none',
        }}
        onClick={showDateCalendarModalBtn}
      ></div>
    </ShadowBox>
  );
}
