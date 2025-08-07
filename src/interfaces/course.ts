export interface Course {
  id: number;
  title: string;
  professor: string;
  type: string; // 예: "전공핵심", "전공선택" 등
  grade: number; // 학년
  credit: number; // 학점
  tags: string[];
  liked: boolean; // 로그인한 유저가 좋아요를 눌렀는지 여부
  department: string; // 학과 문자열 리터럴로 해야될수도
  likes: number;
  starRating: number; // 평점 0~5
}

export interface CourseDetail extends Course {
  evaluation: string; // 예: "이수인정", "학점인정" 등
  lectureType: string; // 예: "RISE(시간표 없음)", "시간표 있음" 등
  schedule: string[]; // 시간표 정보가 문자열 배열로 들어올 수도 있음 (아니면 구조 바꿔야 함)
  preCourse: string | null; // 선수과목, 없으면 null
  emotion: {
    hard: number; // 어려움 정도
    ok: number; // 보통 정도
    best: number; // 최고 정도
  };
  openKeyword: boolean; // 키워드 공개 여부
  liked: boolean | null; // 로그인 여부에 따라 null일 수 있음
}

// export interface CourseDetail {
//   id: number;
//   title: string;
//   professor: string;
//   type: string; // 예: "전공심화"
//   grade: number; // 0 = 학년 없음 or 전체 학년
//   credit: number; // 학점
//   tags: string[]; // 태그 배열 (비어있을 수도 있음)
//   department: string; // 예: "컴퓨터공학부"
//   college: string; // 예: "정보기술대학"
//   evaluation: string; // 예: "이수인정"
//   lectureType: string; // 예: "RISE(시간표 없음)"
//   schedule: string[]; // 시간표 정보가 문자열 배열로 들어올 수도 있음 (아니면 구조 바꿔야 함)
//   preCourse: string | null; // 선수과목, 없으면 null
//   emotion: {
//     hard: number;
//     ok: number;
//     best: number;
//   };
//   openKeyword: boolean;
//   likes: number;
//   liked: boolean | null; // 로그인 여부에 따라 null일 수 있음
// }
