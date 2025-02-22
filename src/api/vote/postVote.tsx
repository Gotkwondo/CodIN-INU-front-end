import axios, {AxiosResponse} from 'axios';

const BASE_URL = 'https://www.codin.co.kr/api';

export const PostVote = async (accessToken:string, title:string, content:string, pollOptions:string[], multipleChoice:boolean, pollEndTime:string, anonymous:boolean): Promise<any> => {
    console.log("전송 데이터", title,content,pollOptions,multipleChoice,pollEndTime,anonymous );
    axios.defaults.withCredentials = true;
    try{
        await axios.post(
            `${BASE_URL}/polls`, 
            {
                title:title,
                content:content,
                pollOptions: pollOptions,
                multipleChoice: multipleChoice,
                pollEndTime:pollEndTime,
                anonymous:anonymous,
                postCategory:"POLL"
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
            PostVote(refreshToken,title,content,pollOptions,multipleChoice,pollEndTime,anonymous);

          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
    
        throw error;
      }
}