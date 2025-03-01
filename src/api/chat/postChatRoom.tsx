import axios, { AxiosResponse } from "axios";
import { PostReissue } from "../user/postReissue";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostChatRoom = async (
  roomName: string,
  receiverId: string
): Promise<any> => {
  console.log("전송 데이터", roomName, receiverId);
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${apiUrl}/chatroom`,

      {
        roomName: roomName,
        receiverId: receiverId,
      }
    );

    console.log(response.data);
    console.log(response.headers);
    return response;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
      if (status === 401) {
              console.error(
                "401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다."
              );
              PostReissue();
              PostChatRoom(roomName,receiverId)
            }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};

/**
 * 채팅방 생성 함수
 * @param {string} title - 채팅방 제목
 * @param {string} userId - 상대방 사용자 ID
 */
export const startChat = async (title, userId) => {
  try {
    const response = await PostChatRoom(title, userId);
    console.log("채팅방 생성이 완료되었습니다", response);

    if (response?.data.data.chatRoomId) {
      window.location.href = `/chat`;
    } else {
      throw new Error("Chat room ID is missing in the response.");
    }
  } catch (error) {
    console.error("채팅방 생성에 실패하였습니다.", error);
  }
};
