// src/api/clients/fetchClient.ts
import { PostReissue } from '../user/postReissue';

export interface FetchOptions extends RequestInit {
  _retry?: boolean;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function fetchClient(
  path: string,
  init?: FetchOptions
): Promise<Response> {
  const url = `${apiUrl}${path}`;
  const options: FetchOptions = {
    ...init,
    credentials: 'include', // 쿠키를 자동 포함
    headers: {
      ...(init?.headers || {}),
    },
  };

  let response = await fetch(url, options);

  // 401인 경우 reissue 후 재요청
  if (response.status === 401 && !init?._retry) {
    try {
      console.log('🔄 401 Unauthorized - 토큰 재발급 시도 중...');
      await PostReissue(); // 쿠키 기반이므로 별도 토큰 전달 불필요

      const retryOptions: FetchOptions = {
        ...options,
        _retry: true,
      };

      response = await fetch(url, retryOptions); // 재요청
    } catch (err) {
      console.error('❌ 토큰 재발급 실패', err);
      throw err;
    }
  }

  return response;
}
