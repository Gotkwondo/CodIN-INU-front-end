// src/app/oauth-success/page.tsx
'use client';

import { useEffect } from 'react';

const OAuthSuccess = () => {
  useEffect(() => {
    // ✅ React Native WebView에 로그인 성공 메시지 전달
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'LOGIN_SUCCESS' })
      );
    }

    // ✅ 메인 화면으로 리디렉션
    window.location.href = 'https://front-end-dun-mu.vercel.app/main';
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>로그인 성공 🎉</h1>
      <p>잠시 후 메인 페이지로 이동합니다...</p>
    </div>
  );
};

export default OAuthSuccess;
