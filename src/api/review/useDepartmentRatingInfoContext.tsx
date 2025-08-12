import axios from 'axios';

type useDepartmentRatingInfoContextType = {
  departmentId: string;
}

const useDepartmentRatingInfoContext = async ({ departmentId }: useDepartmentRatingInfoContextType) => {
  axios.defaults.withCredentials = true;
 
  try {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/lectures/${departmentId}`,
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

export { useDepartmentRatingInfoContext };