// src/api/clients/apiClient.ts
import axios, { AxiosInstance } from "axios";

// 쿠키에서 특정 이름의 값을 읽어오는 함수
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function createAPIClient(): AxiosInstance {
  axios.defaults.withCredentials = true;
  const client = axios.create({
    baseURL: apiUrl,
  });

  // 요청 인터셉터
  client.interceptors.request.use(
    (config) => {
      const token = getCookie("accessToken");  // 쿠키에서 accessToken 읽기
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
          const refreshToken = getCookie("refresh-token");  // 쿠키에서 refresh-token 읽기
          if (refreshToken) {
            const { data } = await axios.post(`${apiUrl}/auth/refresh`, {
              refreshToken,
            });
            if (data?.success) {
              // 새로 받은 accessToken을 쿠키에 저장
              document.cookie = `accessToken=${data.data.accessToken}; path=/; secure; HttpOnly`;

              // 토큰을 갱신하고 요청 재시도
              error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
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
