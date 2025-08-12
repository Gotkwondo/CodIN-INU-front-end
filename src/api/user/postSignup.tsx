import axios, { AxiosResponse } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostSignup = async (
  email: string | string[],
  nickname: string,
  profileImage: File
): Promise<any> => {
  console.log("전송 데이터", email, nickname);
  axios.defaults.withCredentials = true;
  try {
    const formData = new FormData();
    const userProfileRequestDto = {
      email: email,
      nickname: nickname,
    };

    formData.append(
      "userProfileRequestDto ",
      JSON.stringify(userProfileRequestDto)
    );

    const userImage = profileImage;

    formData.append("userImage", userImage);

    // axios 요청 보내기
    const response: AxiosResponse<any> = await axios.post(
      `${apiUrl}/auth/signup`,
      formData, // JSON 문자열로 전송
      {
        headers: {
          "Content-Type": "multipart/form-data", // JSON 형식으로 보내기 위해 Content-Type 설정
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};
