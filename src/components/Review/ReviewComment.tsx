import { useReviewLikeToggleContext } from '@/api/review/useReviewLikeToggleContext';
import { useState } from 'react';
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

type ReviewCommentType = {
  starRating: number;
  content: string;
  likes: number;
  isLiked: boolean; // 추가: 좋아요 여부
  semester: string;
  _id: string;
};

const ReviewComment = ({
  starRating = 0,
  content = "Blank",
  likes = 0,
  isLiked = false,
  semester = "test",
  _id,
}: ReviewCommentType) => {
  const [heartClick, setHeartClick] = useState(isLiked);
  
  const handleHeartClick = () => {
    setHeartClick(!heartClick);
    // API 추가(하트 상태 변경)
    useReviewLikeToggleContext({ _id: _id });
    console.log(heartClick);
  };
  return (
    <div className="border-t">
      <div className="mt-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-xl">
            {`${starRating % 1 ? starRating : starRating + ".0"}`}
          </p>
          {heartClick ? (
            <FaHeart
              fill={"#0D99FF"}
              style={{ width: "20px", height: "20px" }}
              onClick={handleHeartClick}
            />
          ) : (
            <CiHeart
              fill={"#0D99FF"}
              style={{ width: "20px", height: "20px" }}
              onClick={handleHeartClick}
            />
          )}
        </div>
        <div className="flex justify-start items-center w-full mt-2">
          <p className="text-lg text-wrap break-all">{content}</p>
        </div>
        <div className="flex justify-between items-center w-full mt-2">
          {/* <p className="text-lg text-wrap break-all">{testText}</p> */}
          <p className="text-xl">{semester + "학기 수강생"}</p>
          <div className="flex items-center">
            <p>{likes}</p>
            <CiHeart className="ml-1" fill={"#808080"} color={"#808080"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { ReviewComment };