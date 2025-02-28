import axios from "axios";

type useSearchedReviewContextType = {
  department?: string;
  grade?: string;
  semester?: string;
};

const useSearchedReviewContext = async ({
  department,
  grade,
  semester,
}: useSearchedReviewContextType) => {
  axios.defaults.withCredentials = true;

  try {
    const params = new URLSearchParams({
      department: department,
      grade: `${grade}`,
      semester: semester,
    });

    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lectures/search-review?${params}`,
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
  }
};

export { useSearchedReviewContext };
