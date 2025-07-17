'use client';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import { Suspense, use } from 'react';

export default function CourseDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>운영체제</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="relative px-[35px] py-[28px] shadow-05134 rounded-[15px]">
          <div className="flex flex-col text-[12px] gap-[4px]">
            <div className="font-bold">정보기술대학 &gt; 컴퓨터공학부</div>
            <div className="font-bold">전공핵심 / 상대평가</div>
            <div className="font-bold">대면강의</div>
            <div className="font-bold">
              <span>교수명 : </span>
              <span className="text-sr">박문주</span>
            </div>
            <div className="font-bold">
              <span>과목코드 : </span>
              <span className="text-sr">IAA6018</span>
            </div>
          </div>
          <div className="absolute bottom-[13px] right-[20px] p-[3px] border-b text-[11px] text-active border-b-[#0D99FF]">
            <span>강의 계획서 자세히 보기</span>
          </div>
        </div>
      </DefaultBody>
    </Suspense>
  );
}
