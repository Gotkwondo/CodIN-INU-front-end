"use client";

import DefaultBody from "@/components/Layout/Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import Header from "@/components/Layout/header/Header";
import { RateBar } from "@/components/Review/RateBar";
import {
  SetStateAction,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import { departMentType, selectType } from "./type";
import {
  DEPARTMENT,
  GRADE,
  SEMESTER,
  ALERTMESSAGE,
  TEMPLATETEXT,
} from "./constants";
import { CustomSelect } from "@/components/Review/CustomSelect";
import { useSearchedReviewContext } from "@/api/review/useSearchedReviewContext";
import { AlertModal } from "@/components/modals/AlertModal";
import { submitReview } from "@/api/review/submitReview";
import { useRouter } from "next/navigation";
import { calcEmotion } from "./util/calcEmotion";
import { ReviewContext } from "@/context/WriteReviewContext";

const WriteReview = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [rating, setRating] = useState(0);
  const [lecture, setLecture] = useState<selectType>({
    label: "학과",
    value: "",
  });
  const [grade, setGrade] = useState<selectType>({
    label: "학년",
    value: "",
  });
  const [semester, setSemester] = useState<selectType>({
    label: "학기",
    value: "",
  });
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState<selectType>({
    label: "학과, 학년, 학기를 선택해주세요",
    value: "",
  });
  const [reviewContents, setReviewContents] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data } = useContext(ReviewContext);

  const getReviewList = async () => {
    try {
      const response = await useSearchedReviewContext({
        department: lecture.value,
        grade: grade.value,
        semester: semester.value,
      });
      const data = response.dataList.map((e: departMentType) => {
        return {
          label: `(${semester.value})(${e.professor}) ${e.lectureNm}`,
          value: e._id,
        };
      });
      setDepartmentList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSummitReview = async () => {
    if (department.value === "") return;
    else {
      const response = await submitReview({
        lectureId: department.value,
        content: reviewContents,
        starRating: rating,
        semester: semester.value,
      });
      const message = response.message;
      alert(message);
      router.back();
    }
  };

  useEffect(() => {
    // if (data.departments.value !== '' && data.grade) {
    //   setLecture(data.departments);
    //   setGrade(data.grade);
    // }
    if (data.departments.value !== "") {
      setLecture(data.departments);
    }
    if (data.grade.value !== "") {
      setGrade(data.grade);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    if (
      lecture.value !== "null" &&
      grade.value !== "null" &&
      semester.value !== "null"
    ) {
      getReviewList();
      setDepartment({ label: "학과, 학년, 학기를 선택해주세요", value: "" });
    }
  }, [lecture, grade, semester]);

  if (!isClient) return null; // 서버에서는 렌더링하지 않음
  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>후기 작성하기</Header.Title>
      </Header>
      <DefaultBody hasHeader={1}>
        <div className="flex flex-col justify-between h-[70vh] sm:h-[80vh]">
          <div>
            <div className="w-full flex">
              {/* 학과 학년 수강학기 선택 */}
              <CustomSelect
                options={DEPARTMENT}
                onChange={(selected: SetStateAction<selectType>) =>
                  setLecture(selected)
                }
                value={lecture}
                isSearchable={false}
                minWidth={6.2}
                inverted
                rounded
              />
              <CustomSelect
                options={GRADE}
                onChange={(selected: SetStateAction<selectType>) =>
                  setGrade(selected)
                }
                value={grade}
                isSearchable={false}
                minWidth={6.7}
                inverted
                rounded
              />
              <CustomSelect
                options={SEMESTER}
                onChange={(selected: SetStateAction<selectType>) =>
                  setSemester(selected)
                }
                value={semester}
                isSearchable={false}
                minWidth={7}
                inverted
                rounded
              />
            </div>
            {/* 수강 강의 선택 */}
            <div className="mt-5">
              <CustomSelect
                options={departmentList}
                onChange={(selected: SetStateAction<selectType>) =>
                  setDepartment(selected)
                }
                value={department}
                isSearchable={false}
              />
            </div>

            <p className="text-base sm:text-xl mt-3 sm:mt-8">
              전반적인 수업 경험은 어땠나요?
            </p>
            {/* 수업 후기 점수 평가  */}
            <div className="w-full mt-2">
              {/* 1-5점  해당 바를 눌러 점수를 정할 수 있도록 기능 구현 필요*/}
              <div className="text-base sm:text-xl flex">
                <div className=" w-32 min-w-32">
                  <span className="text-[#0D99FF] text-right">{`${
                    rating % 1 ? rating : rating + ".0"
                  }`}</span>{" "}
                  <span className="text-[#E5E7EB]">/ 5.0</span>
                </div>

                <span className="text-[#0D99FF]">{calcEmotion(rating)}</span>
              </div>
              <RateBar
                score={rating}
                barWidth={1}
                clickable={true}
                clickFn={setRating}
                className="mt-1"
              />
              <p className="text-sm sm:text-base mt-3 text-[#808080]">
                위 그래프를 눌러 조절해주세요
              </p>
            </div>
            {/* 후기 입력 공간 */}
            <div className="mt-3">
              {/* 후기 내용 */}
              <textarea
                className="border-2 border-gray-200 rounded-md p-3 sm:mt-5 w-full h-[20vh] sm:h-[30vh] resize-none"
                placeholder="상세한 후기를 작성해주세요"
                onChange={(e) => setReviewContents(e.target.value)}
                value={reviewContents}
              ></textarea>
            </div>
            <div className="w-full flex justify-end sm:mt-3">
              <button
                className="bg-[#0D99FF] text-white rounded-full px-4 py-2 hover:bg-[#51b4fa]"
                onClick={() => {
                  // setReviewContents('강의와 교재는? : \n과제는? : \n시험은? : \n조별 과제는? : \n\n\n나만의 꿀팁 : ');
                  setIsModalOpen(true);
                }}
              >
                템플릿 사용하기
              </button>
            </div>
          </div>
          <button
            className="h-[35px] sm:h-[50px] bg-[#0D99FF] text-white mt-2 sm:mt-4 rounded-md bottom-[-100px] text-sm sm:text-base"
            onClick={() => onSummitReview()}
          >
            후기 작성하기
          </button>
        </div>

        {isModalOpen && (
          <AlertModal
            text={ALERTMESSAGE}
            templateText={TEMPLATETEXT}
            modalStateSetter={setReviewContents}
            onClose={setIsModalOpen}
          />
        )}
      </DefaultBody>

      <BottomNav activeIndex={3} />
    </Suspense>
  );
};

export default WriteReview;
