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


/**
 * 채팅방 생성 함수
 * @param {string} title - 채팅방 제목
 * @param {string} userId - 상대방 사용자 ID
 */
export const startChat = async (title, userId) => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            throw new Error("Access token is missing. Please login again.");
        }

        const response = await PostChatRoom(accessToken, title, userId);
        console.log("채팅방 생성이 완료되었습니다", response);

        if (response?.data.data.chatRoomId) {
            window.location.href = `/chatRoom/${response.id}`;
        } else {
            throw new Error("Chat room ID is missing in the response.");
        }
    } catch (error) {
        console.error("채팅방 생성에 실패하였습니다.", error);
    }
};

