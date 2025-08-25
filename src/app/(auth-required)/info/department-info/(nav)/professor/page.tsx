'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import { useEffect, useState } from 'react';

export default function Professor() {
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [professorPosts, setProfessorPosts] = useState([]); // 교수님 및 연구실 데이터 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchProfessorPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchClient('/info/lab');
        if (response.success) {
          setProfessorPosts(response.dataList);
        } else {
          setError(response.message || '데이터를 가져오는 데 실패했습니다.');
        }
      } catch (err) {
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorPosts();
  }, []);

  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-500">로딩 중...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4">
          {professorPosts.map(post => (
            <li
              key={post.id}
              className="p-4 border rounded-lg shadow-05134 bg-white"
            >
              <h2 className="font-bold text-gray-800">{post.title}</h2>
              <p className="text-gray-600 mt-1">{post.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                담당 교수: {post.professor}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
