import axios from "axios";

type useReviewContextType = {
  department: string;
  option: string;
  page: number;
};

const useReviewsContext = async ({ department, option, page }: useReviewContextType) => {
  const token = localStorage.getItem("accessToken");
  axios.defaults.withCredentials = true;
  if (!token) {
    alert("로그인이 필요합니다. 다시 로그인해주세요.");
    return;
  }

  try {
    const parameters = new URLSearchParams({
      // lectureId: lectureId,
      department: department,
      option: option,
      page: `${page}`,
    });

    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lectures/list?${parameters}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    return result.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      console.error('Error response:', status, data);
      if (status === 401) {
        console.error('401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.');
        const refreshToken = localStorage.getItem('refresh-token');
        localStorage.setItem('accessToken', refreshToken);

      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
}

export { useReviewsContext };