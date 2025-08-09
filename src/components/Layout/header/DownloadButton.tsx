// components/DownloadButton.tsx
'use client';
import React, { useState } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';

interface DownloadButtonProps {
  endpoint: string; // 백엔드 API 경로 (예: "/files/report")
  filename?: string; // 저장할 파일 이름
  method?: 'GET' | 'POST';
  body?: any; // POST 시 보낼 데이터
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  endpoint,
  filename = 'download.file',
  method = 'GET',
  body,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      const res = await fetchClient<Blob>(endpoint, {
        method,
        body: method === 'POST' && body ? JSON.stringify(body) : undefined,
        headers:
          method === 'POST'
            ? { 'Content-Type': 'application/json' }
            : undefined,
      });

      // fetchClient는 JSON이면 객체, 파일이면 Blob URL이 아니라 텍스트일 수 있음
      // 여기서는 Blob 응답을 기대하므로 타입 체크 필요
      if (res instanceof Blob) {
        // Blob 응답이면 바로 다운로드
        const url = window.URL.createObjectURL(res);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // Blob이 아닌 경우(예: JSON 메시지) 처리
        console.warn('다운로드 응답이 파일이 아닙니다:', res);
        alert('서버에서 파일이 아닌 응답을 받았습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('파일 다운로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`px-4 py-2 rounded font-bold ${
        loading ? 'bg-gray-100' : ''
      }`}
    >
      <img src='/icons/button/download.svg' className='pointer-events-none'></img>
    </button>
  );
};

export default DownloadButton;
