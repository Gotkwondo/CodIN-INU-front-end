"use client";

import DefaultBody from "@/components/Layout/Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import Header from "@/components/Layout/header/Header";
import { RateBar } from '@/components/Review/RateBar';
import { Suspense, useEffect, useState } from "react";
import { selectType } from './type';
import Select from 'react-select';
import { DEPARTMENT, GRADE, SEMESTER } from './constants';
import { CustomSelect } from '@/components/Review/CustomSelect';



const WriteReview = () => {
  const [isClient, setIsClient] = useState(false);
  const [rating, setRating] = useState(0);
  const [lecture, setLecture] = useState<selectType>({
    label: "학과",
    value: "null",
  });
  const [grade, setGrade] = useState<selectType>({
    label: "학년",
    value: "null",
  });
  const [semester, setSemester] = useState<selectType>({
    label: "수강 학기",
    value: "null",
  });
  console.log(lecture);
  

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // 서버에서는 렌더링하지 않음
  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>후기 작성하기</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="mt-28 w-11/12 flex">
          {/* 학과 학년 수강학기 선택 */}
          <CustomSelect
            options={DEPARTMENT}
            onChange={(selected) => setLecture(selected)}
            value={lecture}
            isSearchable={false}
            minWidth={4}
          />
          <CustomSelect
            options={GRADE}
            onChange={(selected) => setGrade(selected)}
            value={grade}
            isSearchable={false}
            minWidth={4}
          />
          <CustomSelect
            options={SEMESTER}
            onChange={(selected) => setSemester(selected)}
            value={semester}
            isSearchable={false}
            minWidth={8}
          />
        </div>
        {/* 수강 강의 선택 */}
        <div className="mt-5"></div>

        <p className="text-2xl">전반적인 수업 경험은 어땠나요?</p>
        {/* 수업 후기 점수 평가  */}
        <div className="w-full mt-2">
          {/* 1-5점  해당 바를 눌러 점수를 정할 수 있도록 기능 구현 필요*/}
          <p className="text-xl">
            <span className="text-[#0D99FF]">{`${
              rating % 1 ? rating : rating + ".0"
            }`}</span>{" "}
            / 5.0
          </p>
          <RateBar
            score={rating}
            barWidth={1}
            clickable={true}
            clickFn={setRating}
            className="mt-1"
          />
          <p className="text-base mt-3">위 그래프를 눌러 조절해주세요</p>
        </div>
        {/* 후기 입력 공간 */}
        <div></div>
      </DefaultBody>
      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default WriteReview;
