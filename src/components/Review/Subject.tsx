'use client'

import { ComponentProps } from 'react';
import { RateBar } from './RateBar';
import Link from 'next/link';

type SubjectType = {
  subjectName: string;
  subjectCode: string | number;
  professor: string;
  score: number;
  rateCnt: number;
  grade: number;
  semesters: string[];
} & ComponentProps<'div'>;

const Subject = ({ subjectName, subjectCode, professor, score, rateCnt, grade, semesters, ...rest }: SubjectType) => {
  return (
    <div className="group w-full h-40 mb-4 p-4 hover:bg-[#EBF0F7]" {...rest}>
      {/* <p className="text-[#D4D4D4]">{`<li>`}</p> */}
      <div className="w-full flex flex-row justify-between">
        <div className="w-1/2 text-xl">
          <Link href={`./course-reviews/${encodeURIComponent(subjectCode)}`}>
            <p className="mb-2">{subjectName}</p>
          </Link>
          <div className="w-full text-sm flex font-semibold">
            <div className="w-[4.5rem] text-start text-[#808080] font-normal">
              교수명
            </div>
            {professor}
          </div>
          <div className="w-full text-sm flex font-semibold">
            <div className="min-w-10 mr-[2rem] text-start text-[#808080] font-normal">
              학기
            </div>
            <p className="text-wrap pr-3">{semesters.join(", ")}</p>
          </div>
        </div>
        <div className="w-1/2 text-end text-[#EBF0F7] group-hover:text-white">
          <p className="text-xl ">
            <span className="text-[#0D99FF]">{`${
              score % 1 ? score : score + ".0"
            }`}</span>{" "}
            / 5.0
          </p>
          <RateBar score={score} barWidth={2} className="mt-2" />
          <p className="mt-2 text-xs text-[#808080]">{`${rateCnt} 명의 학생이 평가했어요`}</p>
        </div>
      </div>
      {/* <p className="text-end text-[#D4D4D4]">{`</li>`}</p> */}
    </div>
  );
};

export { Subject };