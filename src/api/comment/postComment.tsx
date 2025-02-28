import axios, { AxiosResponse } from "axios";
import { PostReissue } from "../user/postReissue";

const BASE_URL = "https://codin.inu.ac.kr/api";

export const PostComments = async (
  postId: string | string[],
  content: string,
  anonymous: boolean
): Promise<any> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${BASE_URL}/comments/${postId}`,
      {
        content: content,
        anonymous: anonymous,
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
