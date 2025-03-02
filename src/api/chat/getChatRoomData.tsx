import axios, {AxiosResponse} from 'axios';
import { PostReissue } from '../user/postReissue';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const GetChatRoomData = async (retryCount = 0): Promise<any> => {
    axios.defaults.withCredentials = true;
    try{
        const response: AxiosResponse<any> = await axios.get(
            `${apiUrl}/chatroom`,
          
        );
        console.log(response.data);
        return response;
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          console.error('Error response:', status, data);
          if (status === 401){
            console.error("401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.");

        if (retryCount < 2) {
          console.log(`🔄 재시도 중... (${retryCount + 1}/2)`);
          const res = await PostReissue(); // 토큰 재발급 요청
          console.log(res);
          return GetChatRoomData(retryCount + 1); // 재요청
        }

        console.error("❌ 2번 재시도 후에도 실패. 로그인 페이지로 이동합니다.");
        window.location.href = "/login";

          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
    
        throw error;
      }
}