import axios, {AxiosResponse} from 'axios';

const BASE_URL = 'https://www.codin.co.kr/api';

export const deleteRoom = async (accessToken:string, chatRoomId:string | string[]): Promise<any> => {
    console.log("전송 데이터", chatRoomId);
    axios.defaults.withCredentials = true;
    try{
        const response: AxiosResponse<any> = await axios.delete(
            `${BASE_URL}/chatroom/${chatRoomId}`,
            
            { headers: {
                Authorization: ` ${accessToken}`
             }},
        );

        console.log(response.data);
        console.log(response.headers);
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