"use client";

import { ComponentProps } from "react";
import { RateBar } from "./RateBar";

type SubjectType = {
  subjectName: string;
  professor: string;
  score: {
    hard: number;
    ok: number;
    best: number;
  };
  starRating: number;
} & ComponentProps<"div">;

const DepartmentReviewComponent = ({
  subjectName,
  professor,
  score,
  starRating,
}: SubjectType) => {
  return (
    <div className="w-full h-64 mb-4">
      <div className="w-full flex flex-row justify-between">
        <div className="w-full text-xl">
          <div className="w-full mb-2 flex justify-start">
            <span className="mr-11">{`${subjectName}`}</span>
            <span className="text-xl mr-5">
              <span className="text-[#0D99FF]">{`${
                starRating % 1 ? starRating : starRating + ".0"
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
          <div className="my-5 flex">
            <span className="mr-10">힘들어요</span>
            <div className="flex items-center">
              <RateBar
                score={Math.floor(score.hard * 50) / 10}
                barWidth={0.25}
                className="mr-3"
              />
              <span className="text-base text-[#808080]">{`${
                score.hard + "%"
              }`}</span>
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
              <span className="text-base text-[#808080]">{`${
                score.ok + "%"
              }`}</span>
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
              <span className="text-base text-[#808080]">{`${
                score.best + "%"
              }`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DepartmentReviewComponent };
