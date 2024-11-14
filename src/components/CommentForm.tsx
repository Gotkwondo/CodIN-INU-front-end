// src/components/CommentForm.tsx

'use client';

import { useState } from 'react';

interface CommentFormProps {
    postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // 댓글 전송 로직 구현
        // 예: API 호출하여 서버에 댓글 저장
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment }),
            });
            if (response.ok) {
                // 성공적으로 댓글이 등록되었을 때 처리
                setComment('');
                // 댓글 목록 갱신 등의 추가 작업
            } else {
                // 에러 처리
                console.error('Failed to submit comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
      <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="w-full p-2 border rounded"
          rows={4}
          required
      />
            <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                댓글 등록
            </button>
        </form>
    );
}
