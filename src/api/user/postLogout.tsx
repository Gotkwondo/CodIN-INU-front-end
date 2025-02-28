import axios, { AxiosResponse } from "axios";

const BASE_URL = "https://codin.inu.ac.kr/api";

export const PostLogout = async (): Promise<any> => {
  console.log("전송 데이터");
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${BASE_URL}/auth/logout`
    );

    console.log(response.data);
    return response.data;
  } catch (error: any) {
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
