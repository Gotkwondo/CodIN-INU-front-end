'use client'

import SmRoundedBtn from '@/components/buttons/smRoundedBtn';
import Header from '@/components/Layout/header/Header';
import { DEPARTMENTS, SEARCHTYPES } from './constants';
import { labelType, searchTypesType } from './types';
import { useMemo, useState } from 'react';
import { Input } from '@/components/input/Input';
import { debounce } from 'lodash';
import { UnderbarBtn } from '@/components/buttons/underbarBtn';
import { Subject } from '@/components/common/Review/Subject';
import Link from 'next/link';

const DummyData = [
  {
    subjectName: "C++",
    subjectCode: "0011233001",
    score: 4.5,
    professor: "박경완",
    rateCnt: 30,
  },
  {
    subjectName: "AL",
    subjectCode: "0011224511",
    score: 4.0,
    professor: "오주현",
    rateCnt: 6,
  },
  {
    subjectName: "상담",
    subjectCode: "1511233001",
    score: 5.0,
    professor: "박경완",
    rateCnt: 123,
  },
];

const courseReviewPage = () => {
  // const token = localStorage.getItem("accessToken");
  const [selectedDepartment, setSelectedDepartment] = useState<labelType>({
    label: "",
    value: "",
  });
  const [searchType, setSearchType] = useState<searchTypesType>({
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

  const onSearchTypeChange = ({label, value}: searchTypesType) => {
    if (value === searchType.value) {
      setSearchType({ label: '', value: '' });
    } else {
      setSearchType({ label: label, value: value });
    }
  };

  return (
    <div className="bg-white min-h-screen w-full relative flex flex-row justify-center">
      <Header>
        <Header.Title>수강 후기</Header.Title>
        <Header.BackButton />
      </Header>
      <div className="mt-28 w-11/12">
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
        </div>
        <div className="mt-4 w-full">
          <Input
            className="w-full"
            placeholder="과목명, 교수명 입력"
            value={query}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
          />
          <div className="flex mt-4">
            {SEARCHTYPES.map(({ label, value }: searchTypesType) => {
              return (
                <UnderbarBtn
                  key={`searchType_${value}`}
                  text={label}
                  inverted={value === searchType.value}
                  className="font-semibold"
                  onClick={() => onSearchTypeChange({ label, value })}
                />
              );
            })}
          </div>
        </div>
        {
          DummyData.map(({ subjectName, subjectCode, score, professor, rateCnt }) => {
            return (
              <Link
                href={`/`}
                key={`subject_${subjectCode}_${subjectName}`}
              >
                <Subject
                  subjectName={subjectName}
                  subjectCode={subjectCode}
                  score={score}
                  professor={professor}
                  rateCnt={rateCnt}
                />
              </Link>
            );
          })
        }
      </div>
    </div>
  );
};

export default courseReviewPage;