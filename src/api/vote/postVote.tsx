import axios, { AxiosResponse } from "axios";
import { PostReissue } from "../user/postReissue";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostVote = async (
  title: string,
  content: string,
  pollOptions: string[],
  multipleChoice: boolean,
  pollEndTime: string,
  anonymous: boolean,
  retryCount=0
): Promise<any> => {
  console.log(
    "전송 데이터",
    title,
    content,
    pollOptions,
    multipleChoice,
    pollEndTime,
    anonymous
  );
  axios.defaults.withCredentials = true;
  try {
    await axios.post(`${apiUrl}/polls`, {
      title: title,
      content: content,
      pollOptions: pollOptions,
      multipleChoice: multipleChoice,
      pollEndTime: pollEndTime,
      anonymous: anonymous,
      postCategory: "POLL",
    });
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
                return await PostVote(title,content, pollOptions,
                  multipleChoice,
                  pollEndTime,
                  anonymous,retryCount + 1); // 재요청
            } catch (error) {
                console.error("❌ 토큰 재발급 실패", error);
                // 토큰 재발급 실패시 더 이상 재시도하지 않고 로그인 페이지로 이동
                window.location.href = "/login";
            }
        }
    
        console.error("❌ 2번 재시도 후에도 실패. 로그인 페이지로 이동합니다.");
        window.location.href = "/login";
    }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};