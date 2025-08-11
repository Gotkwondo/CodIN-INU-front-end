import { CourseReview } from '@/interfaces/course';
import Heart from '@public/icons/heart.svg';
import { forwardRef } from 'react';

interface Props {
  review: CourseReview;
}

const Review = forwardRef<HTMLDivElement, Props>(({ review }, ref) => {
  const fav = true; // Replace with actual favorite state if needed
  const { content, starRating, likeCount, semester, liked, likes } = review;

  return (
    <div
      ref={ref}
      className="pt-[15px] pb-[21px] border-t border-[#D4D4D4]"
    >
      <div className="flex justify-between">
        <div className="text-Mm">{starRating.toFixed(1)}</div>
        <div className="flex items-center justify-center">
          <Heart
            width={19}
            height={19}
            stroke={fav ? '#CDCDCD' : '#0D99FF'}
            fill={!fav ? '#0D99FF' : 'none'}
          />
        </div>
      </div>
      <div className="mt-[9px] mb-[12px] text-Mr">{content}</div>
      <div className="flex justify-between items-center text-sr">
        <div className="text-sub">{semester} 학기 수강생</div>
        <div className="flex gap-[3px]">
          <div className="flex justify-center pt-[3px]">
            <Heart
              width={14}
              height={14}
              // stroke="#D2D5D9"
              fill="#D2D5D9"
            />
          </div>
          <div className="text-sub">{likeCount}</div>
        </div>
      </div>
    </div>
  );
});

export default Review;
