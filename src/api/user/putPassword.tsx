import axios, { AxiosResponse } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PutPassword = async (
  code: string | string[],
  password: string
): Promise<any> => {
  console.log("전송 데이터", code, password);
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.put(
      `${apiUrl}/users/password/${code}`,
      {
        password: password,
      }
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
