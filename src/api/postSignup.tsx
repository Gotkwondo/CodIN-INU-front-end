import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://www.codin.co.kr/api';

interface UserData {
  email: string;
  password: string;
  studentId: string;
  name: string;
  nickname: string;
  profileImageUrl: string;  // File로 수정
  department: string;
}

export const PostSignup = async (userData: UserData): Promise<any> => {
  console.log("전송 데이터", userData);

  try {
    const requestData = JSON.stringify({
      email: userData.email,
      password: userData.password,
      studentId: userData.studentId,
      name: userData.name,
      nickname: userData.nickname,
      profileImageUrl: "https://avatars.githubusercontent.com/u/77490521?v=4",
      department: userData.department,
    });

    // axios 요청 보내기
    const response: AxiosResponse<any> = await axios.post(
      `${BASE_URL}/users/signup`, 
      requestData,  // JSON 문자열로 전송
      {
        headers: {
          'Content-Type': 'application/json',  // JSON 형식으로 보내기 위해 Content-Type 설정
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
};
