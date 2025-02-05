'use client'

import SmRoundedBtn from '@/components/buttons/smRoundedBtn';
import Header from '@/components/Layout/header/Header';
import { DEPARTMENTS } from './constants';
import { labelType } from './types';
import { useMemo, useState } from 'react';
import { Input } from '@/components/input/Input';
import { debounce } from 'lodash';

const courseReviewPage = () => {
  const token = localStorage.getItem("accessToken");
  const [selectedDepartment, setSelectedDepartment] = useState<labelType>({
    label: "",
    value: "",
  });
  const [query, setQuery] = useState<string>(""); // 입력값 즉시 반영
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 디바운스된 값

  const selectDepartmentHandler = (
    selectedLabel: string,
    selectedValue: string
  ) => {
    setSelectedDepartment({ label: selectedLabel, value: selectedValue });
  };

  // 디바운스된 검색 함수 (API 호출 시 사용)
  const debouncedSearch = useMemo(
    () =>
      debounce((keyword) => {
        setSearchKeyword(keyword);
      }, 200),
    []
  );

  // 입력 변경 핸들러
  const onSearchKeywordChange = (keyword: string) => {
    setQuery(keyword); // 즉시 업데이트
    debouncedSearch(keyword); // 디바운스 적용된 값 업데이트
  };

  // console.log("실시간 입력값:", query);
  console.log("디바운스된 검색어:", searchKeyword);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden w-full relative">
      <Header>
        <Header.Title>수강 후기</Header.Title>
        <Header.BackButton />
      </Header>
      <div className="mt-28">
        <div className="flex flex-col w-full">
          <div className="w-full flex justify-between">
            {DEPARTMENTS.map(({ label, value }: labelType) => (
              <SmRoundedBtn
                key={`selectDepartment_${value}`}
                text={label}
                onClick={() => selectDepartmentHandler(label, value)}
                status={value === selectedDepartment.value ? 1 : 0}
              />
            ))}
          </div>
          <div className="mt-4 w-full">
            <Input
              className="w-full"
              placeholder="과목명, 교수명 입력"
              value={query}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default courseReviewPage;