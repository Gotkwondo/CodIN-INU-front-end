'use client';

import CourseCard from '@/components/info/courses/card';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import Select from '@/components/select/Select';
import CheckBox from '@public/icons/checkbox.svg';
import Search from '@public/icons/search.svg';
import { Suspense } from 'react';

export default function CoursePage() {
  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>교과목 검색 및 추천 </Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="flex justify-center items-center bg-[#F9F9F9] w-full h-[46px] px-[20px] rounded-[14px] shadow-[0px_6px_7.2px_#B6B6B64D] gap-[16px]">
          <input
            type="text"
            className="w-full px-[20px] text-[13px] bg-transparent placeholder:text-[#CDCDCD] outline-none"
            placeholder="과목명, 관심분야, 희망 직무를 검색해보세요"
          />
          <div>
            <Search
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="mt-[28px] mb- h-[35px]">
          <Select></Select>
        </div>
        <div className="mb-[14px]">
          <div className="flex items-center gap-[11px]">
            <CheckBox
              width={14.25}
              height={14.25}
            />
            <h3 className="text-Mm text-[#808080]">좋아요한 과목 모아보기</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[18px] border-t-[1px] border-[#D4D4D4] pt-[12px]">
          <CourseCard fav={true} />
          <CourseCard fav={false} />
          <CourseCard fav={false} />
        </div>
      </DefaultBody>
    </Suspense>
  );
}

// /main/info/courses

/*
request GET /main/info/courses
headers {
  Authorization: Bearer {accessToken}
}
*/

// interface Course {
//   id: string;
//   department: string;

// }
