import axios, {AxiosResponse} from 'axios';

const BASE_URL = 'https://www.codin.co.kr/api';

export const PostChatRoom = async (accessToken:string, roomName:string, receiverId:string): Promise<any> => {
    console.log("전송 데이터", roomName, receiverId);
    axios.defaults.withCredentials = true;
    try{
        const response: AxiosResponse<any> = await axios.post(
            `${BASE_URL}/chatroom`,
            
            {
                roomName: roomName,
                receiverId:receiverId
                        },
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