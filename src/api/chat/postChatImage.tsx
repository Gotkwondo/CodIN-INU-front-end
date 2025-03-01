import axios, { AxiosResponse } from "axios";
import { PostReissue } from "../user/postReissue";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostChatImage = async (chatImages: File): Promise<any> => {
  console.log("전송 데이터", chatImages);
  axios.defaults.withCredentials = true;
  try {
    const formData = new FormData();

    formData.append("chatImages", chatImages);

    const response = await axios.post(`${apiUrl}/chats/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
      if (status === 401) {
              console.error(
                "401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다."
              );
              PostReissue();
              PostChatImage(chatImages);
            }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};
