import axios from 'axios';

type useReviewLikeToggleContextType = {
  _id: string;
}

const useReviewLikeToggleContext = async ({ _id }: useReviewLikeToggleContextType) => {
  axios.defaults.withCredentials = true;
 

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/likes`,
      {
        likeType: 'REVIEW',
        id: _id,
      },
    );
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