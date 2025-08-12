export interface Lecture {
    lectureNm: string;   // 강의명
    professor: string;   // 교수님 성함
    roomNum: number;     // 강의실 번호
    startTime: string;   // 강의 시작 시간 (HH:mm)
    endTime: string;     // 강의 종료 시간 (HH:mm)
}

export interface LectureDict {
    [roomNum: number]: Lecture[]; // { 101: [Lecture, Lecture, ...], ... }
}