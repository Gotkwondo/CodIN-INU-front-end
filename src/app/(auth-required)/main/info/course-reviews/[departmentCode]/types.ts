type lectureInfoType = {
  _id: string;
  lectureNm: string;
  professor: string;
  starRating: number;
  participants: number;
};

type emotionType = {
  ok: number;
  best: number;
  hard: number;
};

type reviewType = {
  _id: string;
  lectureId: string;
  userId: string;
  content: string;
  starRating: number;
  likes: number;
  isLiked: boolean;
  semester: string;
};