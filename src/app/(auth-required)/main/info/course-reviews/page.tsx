"use client";

import SmRoundedBtn from "@/components/buttons/smRoundedBtn";
import { DEPARTMENTS, SEARCHTYPES } from "./constants";
import { labelType, reviewContentType, searchTypesType } from "./types";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/input/Input";
import { debounce } from "lodash";
import { UnderbarBtn } from "@/components/buttons/underbarBtn";
import { Subject } from "@/components/Review/Subject";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import { useReviewsContext } from "@/api/review/getReviewsContext";

const courseReviewPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<labelType>({
    label: "컴공",
    value: "COMPUTER_SCI",
  });
  const [searchType, setSearchType] = useState<searchTypesType>({
    label: "과목명",
    value: "LEC",
  });

  const [query, setQuery] = useState<string>(""); // 입력값 즉시 반영
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // 디바운스된 값
  const [reviewContents, setReviewContents] = useState<reviewContentType[]>([]);

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

  const onSearchTypeChange = ({ label, value }: searchTypesType) => {
    setSearchType({ label: label, value: value });
  };

  const getReviewsContent = async () => {
    try {
      const data = await useReviewsContext({
        department: selectedDepartment.value,
        option: searchType.value,
        page: 0,
      });
      setReviewContents(data.data.contents);
    } catch (err) {
      alert("데이터를 불러오지 못했습니다");
      setReviewContents([]);
      console.log(err);
    }
  };

  const filterContent = () => {
    console.log("dd");
  };

  useEffect(() => {
    getReviewsContent();
  }, [selectedDepartment]);

  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>수강 후기</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
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
          {reviewContents &&
            reviewContents.map(
              ({ lectureNm, _id, starRating, professor, participants }) => {
                return (
                  <Subject
                    key={`subject_${_id}_${lectureNm}`}
                    subjectName={lectureNm}
                    subjectCode={_id}
                    score={starRating}
                    professor={professor}
                    rateCnt={participants}
                  />
                );
              }
            )}
        </div>
      </DefaultBody>
      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default courseReviewPage;
