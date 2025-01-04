import axios, {AxiosResponse} from 'axios';
import { PostReissue } from './postReissue';

const BASE_URL = 'https://www.codin.co.kr/api';

export const GetChatData = async (accessToken:string, chatRoomId:string, page:number): Promise<any> => {
    axios.defaults.withCredentials = true;
    try{
        console.log('토큰전송:', accessToken);
        const response: AxiosResponse<any> = await axios.get(
            `${BASE_URL}/chats/list/${chatRoomId}?page=${page}`,
            { headers: {
                Authorization: `${accessToken}`
             },
             withCredentials: true}
        );
        
        console.log(response.data);
        return response;
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          console.error('Error response:', status, data);

          if (status === 401){
            console.error('401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.');
            const refreshToken = localStorage.getItem('refresh-token');
            localStorage.setItem('accessToken', refreshToken);
            GetChatData(refreshToken, chatRoomId, page);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
    
        throw error;
      }
}