"use client";

import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import { DepartmentReviewComponent } from "@/components/Review/DepartmentReview";
import { useDepartmentRatingInfoContext } from "@/api/review/useDepartmentRatingInfoContext";
import { ReviewComment } from "@/components/Review/ReviewComment";
import { useLectureReviewsContext } from "@/api/review/useLectureReviewsContext";
import { ReviewBtn } from "@/components/Review/ReviewBtn";

const DepartmentReview = () => {
  const { departmentCode } = useParams();

  const [lectureInfo, setLectureInfo] = useState<lectureInfoType | null>(null);
  const [emotion, setEmotion] = useState<emotionType | null>(null);
  const [reviewList, setReviewList] = useState<reviewType[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);

  const getDepartMentRateInfo = async () => {
    try {
      const response = await useDepartmentRatingInfoContext({
        departmentId: `${departmentCode}`,
      });
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
  };

  const getReviewList = async () => {
    try {
      const response = await useLectureReviewsContext({
        lectureId: `${departmentCode}`,
      });
      const data = response.data;
      setReviewList(data.contents);
    } catch (error) {
      console.error("과목 �� 후기 조회 실��", error);
      alert("과목 �� 후기 조회 실��");
    } finally {
      return;
    }
  };

  useEffect(() => {
    getDepartMentRateInfo();
    getReviewList();
  }, []);

  useEffect(() => {
    getReviewList();
    if (refetch) {
      setRefetch(false);
    }
  }, [refetch]);

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
            starRating={lectureInfo.starRating}
            score={emotion}
          />
        )}
        {reviewList.length > 0 &&
          reviewList.map(
            ({ _id, content, starRating, likeCount, liked, semester }, idx) => {
              return (
                <ReviewComment
                  key={`${_id}_${idx}`}
                  starRating={starRating}
                  content={content}
                  likes={likeCount}
                  isLiked={liked}
                  semester={semester}
                  _id={_id}
                  refetch={setRefetch}
                />
              );
            }
          )}
        <ReviewBtn />
      </DefaultBody>
      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default DepartmentReview;
