export interface Course {
  id: number;
  title: string;
  professor: string;
  type: string; // 예: "전공핵심", "전공선택" 등
  grade: number; // 학년
  credit: number; // 학점
  tags: string[];
  liked: boolean;
  department: string; // 학과 문자열 리터럴로 해야될수도
  likes: number;
}
