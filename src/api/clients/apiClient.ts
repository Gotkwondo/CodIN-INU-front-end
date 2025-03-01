// src/api/clients/apiClient.ts
import axios, { AxiosInstance } from "axios";
import { PostReissue } from "../user/postReissue";

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
              PostReissue();
          } catch (refreshError) {
          console.error("토큰 리이슈 실패:", refreshError);
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
