'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import CourseCard from '@/components/info/courses/card';
import CustomSelect from '@/components/info/courses/customSelect';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import { Course } from '@/interfaces/course';
import CheckBox from '@public/icons/checkbox.svg';
import Search from '@public/icons/search.svg';
import { Suspense, useEffect, useState, useRef, useCallback } from 'react';

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const departments = [
    '전체 학과',
    '컴퓨터공학부',
    '정보통신학과',
    '임베디드 시스템공학과',
  ];
  const orders = [
    '정렬 순서',
    '평점 높은 순',
    '좋아요 많은 순',
    '조회수 순',
    '정확도 순',
  ];

  const fetchCourses = async (page: number) => {
    try {
      setIsLoading(true);

      const res = await fetchClient(`/lectures/courses?page=${page}`);
      const json = await res.json();
      const data = json.data;
      console.log('Fetched courses:', data);
      const newCourses: Course[] = data.contents;

      setCourses(prev => [...prev, ...newCourses]);
      setHasMore(data.nextPage !== -1);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const lastCourseRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1); // 페이지 증가
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchCourses(page);
  }, [page]);

  const handleSelectChange = (value: string) => {
    const query =
      value === '전체 학과' ? '' : `?department=${encodeURIComponent(value)}`;
    console.log(`Selected1: ${value}`);
  };

  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>교과목 검색 및 추천 </Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="flex justify-center items-center bg-[#F9F9F9] w-full h-[46px] px-[20px] rounded-[14px] shadow-[0px_6px_7.2px_#B6B6B64D] gap-[16px]">
          <input
            type="text"
            className="w-full px-[20px] text-[13px] bg-transparent placeholder:text-[#CDCDCD] outline-none"
            placeholder="과목명, 관심분야, 희망 직무를 검색해보세요"
          />
          <div>
            <Search
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="flex justify-end gap-[8px] mt-[28px] mb-[29px] h-[35px]">
          <CustomSelect
            onChange={handleSelectChange}
            options={departments}
          />
          <CustomSelect
            onChange={handleSelectChange}
            options={orders}
          />
        </div>
        <div className="mb-[14px]">
          <div className="flex items-center gap-[11px]">
            <CheckBox
              width={14.25}
              height={14.25}
            />
            <h3 className="text-Mm text-[#808080]">좋아요한 과목 모아보기</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[18px] border-t-[1px] border-[#D4D4D4] pt-[12px]">
          {courses.map((v, i) => {
            const isLast = i === courses.length - 1;
            return (
              <CourseCard
                key={v.id}
                ref={isLast ? lastCourseRef : null}
                value={v}
                fav={v.liked}
              />
            );
          })}
        </div>
      </DefaultBody>
    </Suspense>
  );
}
