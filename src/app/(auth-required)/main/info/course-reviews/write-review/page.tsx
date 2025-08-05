"use client";

import DefaultBody from "@/components/Layout/Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import Header from "@/components/Layout/header/Header";
import { RateBar } from "@/components/Review/RateBar";
import {
  SetStateAction,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { departMentType, selectType } from "./type";
import { DEPARTMENT, GRADE, SELECTINITIALSTATE, SEMESTER } from "./constants";
import { CustomSelect, SelectDepartmentBar, SelectOptionBar } from "@/components/Review/CustomSelect";
import { useSearchedReviewContext } from "@/api/review/useSearchedReviewContext";
import { AlertModal } from "@/components/modals/AlertModal";
import { submitReview } from "@/api/review/submitReview";
import { useRouter } from "next/navigation";
import { calcEmotion } from "./util/calcEmotion";
import { ReviewContext } from "@/context/WriteReviewContext";
import { useSelectReducer } from '@/hooks/useSelectedType';

const WriteReview = () => {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>();

  const [selectedState, selectedStateDispatch] = useSelectReducer(SELECTINITIALSTATE);
  const [isClient, setIsClient] = useState(false);
  const [rating, setRating] = useState(0);
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState<selectType>({
    label: "학과, 학년, 학기를 선택해주세요",
    value: "",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data } = useContext(ReviewContext);

  const getReviewList = useCallback(async () => {
    try {
      const response = await useSearchedReviewContext({
        department: selectedState.lecture.value,
        grade: selectedState.grade.value,
        semester: selectedState.semester.value,
      });
      const data = response.dataList.map((e: departMentType) => {
        return {
          label: `(${selectedState.semester.value})(${e.professor}) ${e.lectureNm}`,
          value: e._id,
        };
      });
      setDepartmentList(data);
    } catch (error) {
      console.error(error);
      return [];
    }
  }, [selectedState]);

  const writeText = (text: string) => {
    textareaRef.current.value = text;
  };

  const onSummitReview = async () => {
    if (department.value === "") return;
    else {
      const response = await submitReview({
        lectureId: selectedState.department.value,
        content: textareaRef.current.value,
        starRating: rating,
        semester: selectedState.semester.value,
      });
      const message = response.message;
      alert(message);
      router.back();
    }
  };

  useEffect(() => {
    setIsClient(true);
    if (data.departments.value !== "") {
      selectedStateDispatch({ type: "lecture", payload: data.departments });
    }
    if (data.grade.value !== "") {
      selectedStateDispatch({ type: "grade", payload: data.grade });
    }
  }, []);

  useEffect(() => {
    if (
      selectedState.lecture.value !== "" &&
      selectedState.grade.value !== "" &&
      selectedState.semester.value !== ""
    ) {
      getReviewList();
    }
  }, [selectedState]);

  if (!isClient) return null; // 서버에서는 렌더링하지 않음
  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>후기 작성하기</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="flex flex-col justify-between">
          <SelectOptionBar>
            {/* 학과 학년 수강학기 선택 */}
            <CustomSelect
              options={DEPARTMENT}
              onChange={(selected) =>
                selectedStateDispatch({ type: "lecture", payload: selected })
              }
              value={selectedState.lecture}
              isSearchable={false}
              minWidth={74}
              inverted
              rounded
            />
            <CustomSelect
              options={GRADE}
              onChange={(selected) =>
                selectedStateDispatch({ type: "grade", payload: selected })
              }
              value={selectedState.grade}
              isSearchable={false}
              minWidth={74}
              inverted
              rounded
            />
            <CustomSelect
              options={SEMESTER}
              onChange={(selected) =>
                selectedStateDispatch({ type: "semester", payload: selected })
              }
              value={selectedState.semester}
              isSearchable={false}
              minWidth={74}
              inverted
              rounded
            />
          </SelectOptionBar>
          {/* 수강 강의 선택 */}
          <SelectDepartmentBar>
            <CustomSelect
              options={departmentList}
              onChange={(selected: SetStateAction<selectType>) =>
                setDepartment(selected)
              }
              value={department}
              isSearchable={false}
            />
          </SelectDepartmentBar>

          <p className="text-XLm mt-[24px]">전반적인 수업 경험은 어땠나요?</p>
          {/* 수업 후기 점수 평가  */}
          <div className="w-full mt-[12px]">
            {/* 1-5점  해당 바를 눌러 점수를 정할 수 있도록 기능 구현 필요*/}
            <div className="text-XLm flex items-center mb-[12px] gap-[16px]">
              <div className="flex">
                <span className="text-[#0D99FF] text-right">{`${
                  rating % 1 ? rating : rating + ".0"
                }`}</span>{" "}
                <span className="text-[#E5E7EB]">/ 5.0 </span>
              </div>

              <span className="text-[#0D99FF] text-Mm">
                {calcEmotion(rating)}
              </span>
            </div>
            <RateBar
              score={rating}
              barWidth={0.625}
              clickable={true}
              clickFn={setRating}
              className="mt-1"
            />
            <p className="text-sr mt-[12px] mb-[24px] text-[#808080]">
              위 그래프를 눌러 조절해주세요
            </p>
          </div>

          {/* 후기 입력 공간 */}
          <div className="mt-3">
            {/* 후기 내용 */}
            <textarea
              ref={textareaRef}
              className="border-[1px] focus:border-[#0D99FF] focus:outline-none focus:ring-1 focus:ring-[#0D99FF] border-gray-200 text-Mr rounded-md px-[16px] py-[12px] sm:mt-5 w-full h-[20vh] sm:h-[30vh] resize-none"
              placeholder="상세한 후기를 작성해주세요"
              onChange={(e) => writeText(e.target.value)}
            ></textarea>
          </div>

          <div className="w-full flex justify-end sm:mt-3">
            <button
              className="bg-[#0D99FF] text-white text-Mm rounded-full px-[16px] py-[8px] mt-[6px] hover:bg-[#51b4fa]"
              onClick={() => setIsModalOpen(true)}
            >
              템플릿 사용하기
            </button>
          </div>

          <button
            className="mt-[48px] h-[50px] bg-[#0D99FF] text-white rounded-md text-XLm"
            onClick={() => onSummitReview()}
          >
            후기 작성하기
          </button>
        </div>

        {isModalOpen && (
          <AlertModal modalStateSetter={writeText} onClose={setIsModalOpen} />
        )}
      </DefaultBody>

      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default WriteReview;
