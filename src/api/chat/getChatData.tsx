import axios, { AxiosResponse } from "axios";
import { PostReissue } from "../user/postReissue";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const GetChatData = async (
  chatRoomId: string | string[],
  page: number
): Promise<any> => {
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${apiUrl}/chats/list/${chatRoomId}?page=${page}`,
      {
        withCredentials: true,
      }
    );

    console.log(response.data);
    return response;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
      if (status === 401){
        console.error('401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.');
        PostReissue();
        GetChatData(chatRoomId,page);

      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};