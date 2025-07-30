'use client';
import Title from '@/components/common/title';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import { Suspense, use } from 'react';
import Heart from '@public/icons/heart.svg';
import Review from '@/components/info/courses/review';
import PercentBox from '@/components/info/courses/percentBox';

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
        <div className="relative px-[35px] py-[28px] shadow-05134 rounded-[15px] z-50">
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
          <div className="absolute bottom-[13px] right-[20px] p-[3px] border-b text-[11px] text-active border-b-[#0D99FF] cursor-pointer">
            <span>강의 계획서 자세히 보기</span>
          </div>
        </div>
        <div className="my-[33px]">
          <Title>이 과목은 선수과목이 있어요</Title>
        </div>
        <div className="mt-[33px]">
          <Title>다음 키워드와 연관있어요</Title>
          <div className="relative px-[23px] py-[15px] mt-[15px] mb-[23px] shadow-05134 rounded-[15px] z-50"></div>
        </div>
        <div>
          <Title>수강 후기</Title>
          <div>
            <div className="relative flex justify-evenly mb-[22px]">
              <div className="flex flex-col items-center my-[13px] py-[14px]">
                <div className="text-[28px] font-[900]">2.0</div>
                {/* 별점 */}
                <div className="text-[#CDCDCD] font-medium text-[10px]">{`${3} 명의 학생이 평가했어요`}</div>
              </div>
              <div className="h-[110px] border-l border-[#D4D4D4]" />
              <div className="flex gap-[16px] py-[5px]">
                <PercentBox
                  percent={77}
                  text="힘들어요"
                />
                <PercentBox
                  percent={77}
                  text="힘들어요"
                />
                <PercentBox
                  percent={77}
                  text="힘들어요"
                />
              </div>
            </div>
            <div>
              <Review />
            </div>
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
