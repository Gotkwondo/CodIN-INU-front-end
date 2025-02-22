import axios, {AxiosResponse} from 'axios';

const BASE_URL = 'https://www.codin.co.kr/api';

export const PostVoting = async (accessToken:string, postId: string, selectedOptions:number[]): Promise<any> => {
    console.log("전송 데이터", );
    axios.defaults.withCredentials = true;
    try{
        await axios.post(
            `${BASE_URL}/polls/voting/${postId}`, 
            {
                selectedOptions:selectedOptions
            } ,{ headers: {
                Authorization: ` ${accessToken}`
             }},
        );
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          console.error('Error response:', status, data);
          if (status === 401){
            console.error('401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다.');
            const refreshToken = localStorage.getItem('refresh-token');
            localStorage.setItem('accessToken', refreshToken);
            PostVoting(refreshToken,postId,selectedOptions );

          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
    
        throw error;
      }
}