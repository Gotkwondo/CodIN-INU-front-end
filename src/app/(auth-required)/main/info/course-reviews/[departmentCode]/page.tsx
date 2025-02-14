'use client'

import { useParams } from "next/navigation";
import { Suspense } from 'react';
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import { RateBar } from '@/components/common/Review/RateBar';
import { DepartmentReviewComponent } from '@/components/common/Review/DepartmentReview';

const DepartmentReview = () => {
  const { departmentCode } = useParams();
  const score = 3;
  const dummy = {
    _id: "6793bd700a55321a455f207e",
    lectureNm: "C++언어",
    professor: "박기석",
    starRating: 0,
    participants: 0,
    emotion: {
      ok: 1.6,
      best: 1.5,
      hard: 0.3
    }
  };
  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>과목 별 후기</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <DepartmentReviewComponent
          subjectName={dummy.lectureNm}
          subjectCode={dummy._id}
          professor={dummy.professor}
          score={dummy.emotion}
          rateCnt={dummy.participants}
        />
      </DefaultBody>
      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default DepartmentReview;
