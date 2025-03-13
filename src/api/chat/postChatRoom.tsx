import axios, { AxiosResponse } from "axios";
import { PostReissue } from "../user/postReissue";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostChatRoom = async (
  roomName: string,
  receiverId: string,
  referenceId : string,
  retryCount=0
): Promise<any> => {
  console.log("전송 데이터", roomName, receiverId);
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${apiUrl}/chatroom`,

      {
        roomName: roomName,
        receiverId: receiverId,
        referenceId: referenceId
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
        console.error("401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.");
    
        if (retryCount < 2) {
            console.log(`🔄 재시도 중... (${retryCount + 1}/2)`);
            
            try {
                const res = await PostReissue(); // 토큰 재발급 요청
                console.log(res);
                
                // PostReissue가 성공한 후에 GetChatRoomData 실행
                return await PostChatRoom(roomName,receiverId,referenceId, retryCount + 1); // 재요청
            } catch (error) {
                console.error("❌ 토큰 재발급 실패", error);
                // 토큰 재발급 실패시 더 이상 재시도하지 않고 로그인 페이지로 이동
                window.location.href = "/login";
            }
        }
    
        console.error("❌ 2번 재시도 후에도 실패. 로그인 페이지로 이동합니다.");
        window.location.href = "/login";
      }else if(data.code === 403) {
        const id = data.message.split("/")[1];
        window.location.href = `/chatRoom/${id}`;

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
export const startChat = async (title, userId, referenceId, retryCount=0) => {
  try {
    const response = await PostChatRoom(title, userId, referenceId);
    console.log("채팅방 생성이 완료되었습니다", response);

    if (response?.data.data.chatRoomId) {
      window.location.href = `/chat`;
    } else {
      throw new Error("Chat room ID is missing in the response.");
    }
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
      if (status === 401) {
        console.error("401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.");
    
        if (retryCount < 2) {
            console.log(`🔄 재시도 중... (${retryCount + 1}/2)`);
            
            try {
                const res = await PostReissue(); // 토큰 재발급 요청
                console.log(res);
                
                // PostReissue가 성공한 후에 GetChatRoomData 실행
                return await startChat(title,userId,referenceId, retryCount + 1); // 재요청
            } catch (error) {
                console.error("❌ 토큰 재발급 실패", error);
                // 토큰 재발급 실패시 더 이상 재시도하지 않고 로그인 페이지로 이동
                window.location.href = "/login";
            }
        }
    
        console.error("❌ 2번 재시도 후에도 실패. 로그인 페이지로 이동합니다.");
        window.location.href = "/login";
      }else if(data.code === 403) {
        const id = data.message.split("/")[1];
        window.location.href = `/chatRoom/${id}`;

      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};
