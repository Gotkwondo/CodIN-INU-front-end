import axios, { AxiosResponse } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const PostReissue = async (): Promise<any> => {
  axios.defaults.withCredentials = true;
  try {

    let response: AxiosResponse<any>;

    if( process.env.NEXT_PUBLIC_ENV === 'dev'){
      console.log(response.data);
      console.log(response.headers);
      return response;
    }else{

      response = await axios.post(
        `${apiUrl}/auth/reissue`
      );

    }

    return response;
    
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
