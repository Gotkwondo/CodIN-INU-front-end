import axios, { AxiosResponse } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostVote = async (
  title: string,
  content: string,
  pollOptions: string[],
  multipleChoice: boolean,
  pollEndTime: string,
  anonymous: boolean
): Promise<any> => {
  console.log(
    "전송 데이터",
    title,
    content,
    pollOptions,
    multipleChoice,
    pollEndTime,
    anonymous
  );
  axios.defaults.withCredentials = true;
  try {
    await axios.post(`${apiUrl}/polls`, {
      title: title,
      content: content,
      pollOptions: pollOptions,
      multipleChoice: multipleChoice,
      pollEndTime: pollEndTime,
      anonymous: anonymous,
      postCategory: "POLL",
    });
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      console.error("Error response:", status, data);
      if (status === 401) {
        console.error(
          "401 Unauthorized: 토큰이 유효하지 않거나 만료되었습니다."
        );
        PostVote(
          title,
          content,
          pollOptions,
          multipleChoice,
          pollEndTime,
          anonymous
        );
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }

    throw error;
  }
};