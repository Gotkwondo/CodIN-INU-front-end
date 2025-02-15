import Image from 'next/image';
import { CiHeart } from "react-icons/ci";

type ReviewCommentType = {
  starRating?: number;
  content?: string;
}

const ReviewComment = ({starRating=0, content='Blank'}: ReviewCommentType) => {
  const isLike = true;
  return (
    <div className="border-t">
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <p className="text-xl">{`${
            starRating % 1 ? starRating : starRating + ".0"
          }`}</p>
          {/* <Image src={HeartIcon} alt='좋아요' width={20} height={20} className='fill-red-700' /> */}
          <CiHeart
            fill={isLike ? "#0D99FF" : ``}
            color={isLike ? "#0D99FF" : ``}
            style={{ width: "20px", height: "20px" }}
          />
        </div>
      </div>
    </div>
  );
}

export { ReviewComment };