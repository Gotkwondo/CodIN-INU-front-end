'use client'

import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from 'react';
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import { DepartmentReviewComponent } from '@/components/common/Review/DepartmentReview';
import { useDepartmentRatingInfoContext } from '@/api/review/useDepartmentRatingInfoContext';
import { ReviewComment } from '@/components/common/Review/ReviewComment';

const DepartmentReview = () => {
  const { departmentCode } = useParams();

  const [lectureInfo, setLectureInfo] = useState<lectureInfoType | null>(null);
  const [emotion, setEmotion] = useState<emotionType | null>(null);
  useDepartmentRatingInfoContext({ departmentId: `${departmentCode}` });

  const getDepartMentRateInfo = async () => {
    try {
      const response = await useDepartmentRatingInfoContext({ departmentId: `${departmentCode}` });
      const data = response.data;
      setLectureInfo({
        _id: data._id,
        lectureNm: data.lectureNm,
        professor: data.professor,
        starRating: data.starRating,
        participants: data.participants,
      });
      setEmotion(data.emotion);
    } catch (error) {
      console.error("과목 �� 후기 조회 실��", error);
      alert("과목 �� 후기 조회 실��");
    } finally {
      return;
    }
  }

  useEffect(() => {
    getDepartMentRateInfo();
  }, []);

  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>과목 별 후기</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        {lectureInfo && emotion && (
          <DepartmentReviewComponent
            subjectName={lectureInfo.lectureNm}
            subjectCode={lectureInfo._id}
            professor={lectureInfo.professor}
            score={emotion}
            rateCnt={lectureInfo.participants}
          />
        )}
        <ReviewComment></ReviewComment>
      </DefaultBody>
      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default DepartmentReview;
