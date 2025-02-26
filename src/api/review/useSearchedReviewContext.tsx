import axios from 'axios';

type useSearchedReviewContextType = {
  department?: string;
  grade?: number;
  semester?: string;
}

const useSearchedReviewContext = ({ department, grade, semester }: useSearchedReviewContextType) => {
  const token = localStorage.getItem("accessToken");
  axios.defaults.withCredentials = true;
  if (!token) { 
    alert("로그인이 필요합니다. 다시 로그인해주세요.");
    return null;
  }
  try {
    const params = new URLSearchParams({
      department: department ?? '',
      grade: grade ? `${grade}` : '',
      semester: semester ?? '',
      page: "0",
    });

    // const result = axios.get(
    //   `${process.env.NEXT_PUBLIC_API_URL}/lectures/search-review`,
    //   {

    //   }
    // );
  } catch (err) {
    console.error(err);
    return null;
  }
}

export { useSearchedReviewContext };