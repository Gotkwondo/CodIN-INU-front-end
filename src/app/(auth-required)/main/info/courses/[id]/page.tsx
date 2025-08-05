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
            <Bold>정보기술대학 &gt; 컴퓨터공학부</Bold>
            <Bold>전공핵심 / 상대평가</Bold>
            <Bold>대면강의</Bold>
            <BoldWithText text="교수명">{`박문주`}</BoldWithText>
            <BoldWithText text="학년">{`3`}학년</BoldWithText>
            <BoldWithText text="학점">{`3`}학점</BoldWithText>
            <div className="flex">
              <Bold>시간 :&nbsp;</Bold>
              <div>
                <p>{`화 09:00 ~ 10:30`}</p>
                <p>{`화 09:00 ~ 10:30`}</p>
              </div>
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

function Bold({ children }: { children: React.ReactNode }) {
  return <span className="font-bold">{children}</span>;
}
function BoldWithText({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <Bold>
      <span>{text} : </span>
      <span className="text-sr">{children}</span>
    </Bold>
  );
}
