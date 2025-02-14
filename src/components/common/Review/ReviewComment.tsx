import Image from 'next/image';
import { CiHeart } from "react-icons/ci";

const ReviewComment = () => {
  const isLike = true;
  return (
    <div className="border-t">
      <div className="flex justify-between items-center">
        <p>{`${"starRating"}`}</p>
        {/* <Image src={HeartIcon} alt='좋아요' width={20} height={20} className='fill-red-700' /> */}
        <CiHeart
          fill={isLike ? "#0D99FF" : ``}
          color={isLike ? "#0D99FF" : ``}
        />
      </div>
    </div>
  );
}

export { ReviewComment };