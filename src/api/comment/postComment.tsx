import axios, {AxiosResponse} from 'axios';
import { PostReissue } from './postReissue';

const BASE_URL = 'https://www.codin.co.kr/api';

export const PostComments = async (accessToken:string, postId:string | string[], content:string, anonymous:boolean): Promise<any> => {
    axios.defaults.withCredentials = true;
    try{
        const response: AxiosResponse<any> = await axios.post(
            `${BASE_URL}/comments/${postId}`,
            {
                content : content,
                anonymous: anonymous
            },
           { headers: {
             Authorization: ` ${accessToken}`
          }},
        );
        console.log('토큰:', accessToken);
        console.log(response.data);
        return response.data;
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          console.error('Error response:', status, data);
          if (status === 401){
            console.error('401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.');
            const refreshToken = localStorage.getItem('refresh-token');
            localStorage.setItem('accessToken', refreshToken);
            PostComments(refreshToken, postId, content, anonymous);

          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
    
        throw error;
      }
}