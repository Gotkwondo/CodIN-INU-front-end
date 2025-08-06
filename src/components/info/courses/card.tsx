import CourseTag from './tag';
import Link from 'next/link';
import Heart from '@public/icons/heart.svg';
import Rating from '@/components/info/rating';
import { Course } from '@/interfaces/course';
import { forwardRef } from 'react';

interface Props {
  fav?: boolean;
  value: Course;
}

const CourseCard = forwardRef<HTMLDivElement, Props>(
  ({ fav = false, value }, ref) => {
    const { id, title, professor, type, grade, credit, tags, department } =
      value;

    return (
      <div ref={ref}>
        <Link
          href={`/main/info/courses/${id}`}
          className="flex items-center aspect-square shadow-05134 rounded-[15px]"
        >
          <div className="relative flex w-full px-[14px] py-[25px] justify-between items-start">
            <div>
              <div className="mb-[12px]">
                <div className="mb-[15px]">
                  <p className="text-[11px] text-[#0D99FF]">{type}</p>
                  <h3 className="text-[16px] font-bold whitespace-nowrap">
                    {title}
                  </h3>
                  <p className="text-[12px] text-sub">{professor}</p>
                </div>
                <div className="mt-[29px] mb-[8px] text-[12px]">
                  <div className="text-sub text-sr">{department}</div>
                  <div className="text-[12px] font-medium">
                    {grade}학년 {credit}학점
                  </div>
                </div>
                <Rating score={3.65} />
              </div>
              <div className="flex gap-[4px] overflow-x-hidden">
                {tags.map((tag, index) => (
                  <CourseTag
                    key={index}
                    tag={tag}
                  />
                ))}
              </div>
            </div>
            <div className="absolute right-[14px] flex gap-[3px] items-center">
              <Heart
                width={16}
                height={16}
                stroke={!fav ? '#CDCDCD' : '#0D99FF'}
                fill={fav ? '#0D99FF' : 'none'}
              />
              <span
                className="text-[11px] h-[16px] leading-[1.45]"
                style={{
                  color: fav ? '#0D99FF' : '#CDCDCD',
                }}
              >
                15
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

export default CourseCard;
