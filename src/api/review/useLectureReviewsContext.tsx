import axios from 'axios';

type useLectureReviewsContextType = {
  lectureId: string;
}

const useLectureReviewsContext = async ({
  lectureId,
}: useLectureReviewsContextType) => {
  axios.defaults.withCredentials = true;
 
  try {
    const params = new URLSearchParams({
      page: '0'
    })
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/reviews/${lectureId}?${params}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
     
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};

export { useLectureReviewsContext };