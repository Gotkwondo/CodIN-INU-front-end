import axios, { AxiosResponse } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostMailCheck = async (
  email: string,
  code: string
): Promise<any> => {
  console.log("전송 데이터", email, code);

  try {
    await axios.post(`${apiUrl}/email/auth/check`, {
      email: email,
      authNum: code,
    });
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
