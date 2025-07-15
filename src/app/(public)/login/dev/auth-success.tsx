
import { useEffect } from 'react';

const OAuthSuccess = () => {
  useEffect(() => {
    // ✅ Native 앱에 로그인 성공 전달
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'LOGIN_SUCCESS' })
      );
    }

    // ✅ 메인 화면으로 리디렉션
    window.location.href = 'https://front-end-dun-mu.vercel.app/main';
  }, []);

  return (
    <html>
      <head>
        <title>로그인 중...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <p>로그인 성공! 메인 페이지로 이동 중입니다...</p>
      </body>
    </html>
  );
};

export default OAuthSuccess;
