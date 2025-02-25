import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://www.codin.co.kr/api';

export const DeleteUser = async (): Promise<any> => {
  console.log("전송 데이터");
  const token = localStorage.getItem("accessToken");
  axios.defaults.withCredentials = true;
  try {
    const response: AxiosResponse<any> = await axios.delete(
      `${BASE_URL}/users`,
      {
        headers: {
          Authorization: `${token}`, // Bearer 토큰으로 인증
        }
    
      }
    );

    console.log(response.data);
    return response.data;
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
