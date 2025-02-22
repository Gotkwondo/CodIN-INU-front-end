import axios from 'axios';

type useReviewLikeToggleContextType = {
  _id: string;
}

const useReviewLikeToggleContext = async ({ _id }: useReviewLikeToggleContextType) => {
  const token = localStorage.getItem("accessToken");
  axios.defaults.withCredentials = true;
  if (!token) {
    alert("로그인이 필요합니다. 다시 로그인해주세요.");
    return;
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/likes`,
      {
        likeType: 'REVIEW',
        id: _id,
      },
      {
        headers: {
          Authorization: ` ${token}`,
        },
      }
    );
    // console.log("토큰:", token);
    // console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
      if (status === 401) {
        console.error(
          "401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다."
        );
        const refreshToken = localStorage.getItem("refresh-token");
        localStorage.setItem("accessToken", refreshToken);
        useReviewLikeToggleContext({ _id: _id });
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  };
};

export { useReviewLikeToggleContext };