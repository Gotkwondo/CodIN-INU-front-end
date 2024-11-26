import axios, {AxiosResponse} from 'axios';

const BASE_URL = 'https://www.codin.co.kr';

export const PostMailCheck = async (email:string, code:string): Promise<any> => {
    console.log("전송 데이터", email, code);

    try{
        await axios.post(
            `${BASE_URL}/email/auth/send`, 
            {
                email: email,
                authNum: code
            }
        );
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