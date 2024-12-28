import axios, {AxiosResponse} from 'axios';

const BASE_URL = 'https://www.codin.co.kr/api';

export const GetChatRoomData = async (accessToken:string): Promise<any> => {
    axios.defaults.withCredentials = true;
    try{
        const response: AxiosResponse<any> = await axios.get(
            `${BASE_URL}/chatroom`,
           { headers: {
             Authorization: ` ${accessToken}`
          }}
        );
        console.log('토큰:', accessToken);
        console.log(response.data);
        return response;
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          console.error('Error response:', status, data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
    
        throw error;
      }
}