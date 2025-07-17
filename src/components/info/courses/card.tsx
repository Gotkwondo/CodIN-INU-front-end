import CourseTag from './tag';
import Link from 'next/link';
import Heart from '@public/icons/heart.svg';

export default function CourseCard({ fav = false }: { fav: boolean }) {
  const id = 'course-id'; // Replace with actual course ID or prop if needed

  return (
    <Link
      href={`/main/info/courses/${id}`}
      className="flex items-center aspect-square shadow-05134 rounded-[15px]"
    >
      <div className="flex w-full px-[16px] py-[22px] justify-between items-start">
        <div>
          <div className="mb-[9px]">
            <div className="mb-[15px]">
              <p className="text-[11px] text-[#0D99FF]">전공 핵심</p>
              <h3 className="text-[16px] font-bold">운영체제</h3>
            </div>
            <div className="text-[12px]">
              <div className="text-[#808080] text-sr">IAA6018</div>
              <div className="font-medium">3학년 3학점</div>
            </div>
          </div>
          <div className="flex gap-[4px] overflow-x-hidden">
            <CourseTag tag="난이도 높음" />
            <CourseTag tag="팀플" />
          </div>
        </div>
        <Heart
          width={16}
          height={16}
          stroke={fav ? '#CDCDCD' : '#0D99FF'}
          fill={!fav ? '#0D99FF' : 'none'}
        />
      </div>
    </Link>
  );
}
