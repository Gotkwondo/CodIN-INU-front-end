// src/api/clients/apiClient.ts
import axios, { AxiosInstance } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function createAPIClient(): AxiosInstance {
  axios.defaults.withCredentials = true;
  const client = axios.create({
    baseURL: apiUrl,
  });

  // 요청 인터셉터
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refresh-token");
          if (refreshToken) {
            const { data } = await axios.post(`${apiUrl}/auth/refresh`, {
              refreshToken,
            });
            if (data?.success) {
              localStorage.setItem("accessToken", data.data.accessToken);
              error.config.headers.Authorization = data.data.accessToken;
              return client.request(error.config);
            }
          }
          window.location.href = "/login";
        } catch (refreshError) {
          console.error("리프레시 토큰 실패:", refreshError);
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
}

const apiClient = createAPIClient();
export default apiClient;
