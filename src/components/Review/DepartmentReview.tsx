"use client";

import { ComponentProps } from "react";
import { RateBar } from "./RateBar";

type SubjectType = {
  subjectName: string;
  subjectCode: string | number;
  professor: string;
  score: {
    hard: number;
    ok: number;
    best: number;
  };
  rateCnt: number;
} & ComponentProps<"div">;

const DepartmentReviewComponent = ({
  subjectName,
  subjectCode,
  professor,
  score,
  rateCnt,
  // ...rest
}: SubjectType) => {
  const totalScore = Math.floor((score.hard + score.ok + score.best) * 10) / 10;

  const calcPercents = (rate: number, total: number) => {
    return Math.floor((rate / total) * 100);
  }
  return (
    <div className="w-full h-64 mb-4">
      <div className="w-full flex flex-row justify-between">
        <div className="w-full text-xl">
          <div className="w-full mb-2 flex justify-start">
            <span className="mr-11">{`${subjectName}`}</span>
            <span className="text-xl mr-5">
              <span className="text-[#0D99FF]">{`${
                totalScore % 1 ? totalScore : totalScore + ".0"
              }`}</span>{" "}
              / 5.0
            </span>
          </div>

          <div className="w-full text-sm flex font-semibold justify-start">
            <span className="w-[4.5rem] mr-11 text-start text-[#808080] font-normal">
              교수명
            </span>
            <span className="w-[6rem]">{`${professor}`}</span>
          </div>
          <div className="w-full text-sm flex font-semibold mt-1 justify-start mb-4">
            <div className="w-[4.5rem] mr-11 text-start text-[#808080] font-normal">
              과목 코드
            </div>
            <span className="w-[6rem] text-wrap break-all">{`${subjectCode}`}</span>
          </div>
          <div className="mb-3 flex">
            <span className="mr-10">힘들어요</span>
            <div className="flex items-center">
              <RateBar
                score={Math.floor(score.hard * 50) / 10}
                barWidth={0.25}
                className="mr-3"
              />
              <span className="text-base text-[#808080]">{`${calcPercents(score.hard, 1) + "%"}`}</span>
            </div>
          </div>
          <div className="mb-3 flex">
            <span className="mr-10">괜찮아요</span>
            <div className="flex items-center">
              <RateBar
                score={Math.floor(score.ok * 25) / 10}
                barWidth={0.25}
                className="mr-3"
              />
              <span className="text-base text-[#808080]">{`${calcPercents(score.ok, 2) + "%"}`}</span>
            </div>
          </div>
          <div className="mb-3 flex">
            <span className="mr-10">최고에요</span>
            <div className="flex items-center">
              <RateBar
                score={Math.floor(score.best * 25) / 10}
                barWidth={0.25}
                className="mr-3"
              />
              <span className="text-base text-[#808080]">{`${calcPercents(score.best, 2) + "%"}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DepartmentReviewComponent };
