import axios from "axios";

type useReviewContextType = {
  department: string;
  option: string;
  page: number;
  keyword?: string;
};

const useReviewsContext = async ({ department, option, page, keyword='' }: useReviewContextType) => {
  const token = localStorage.getItem("accessToken");
  axios.defaults.withCredentials = true;
  

  try {
    const parameters = new URLSearchParams({
      department: department,
      keyword: keyword,
      option: option,
      page: `${page}`,
    });

    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lectures/list?${parameters}`,
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
      console.error('Error response:', status, data);
     
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
}

export { useReviewsContext };