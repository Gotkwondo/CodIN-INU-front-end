// src/components/CommentList.tsx

'use client';

import { useEffect, useState } from 'react';
import { Comment } from '@/interfaces/Comment';

interface CommentListProps {
    postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        // 댓글 목록 가져오기
        async function fetchComments() {
            try {
                const response = await fetch(`/api/posts/${postId}/comments`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data.comments);
                } else {
                    console.error('Failed to fetch comments');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
        fetchComments();
    }, [postId]);

    return (
        <ul className="mt-4 space-y-4">
            {comments.map((comment) => (
                <li key={comment.id} className="border-b pb-4">
                    <p className="text-sm text-gray-800">{comment.content}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                        <span>{comment.author}</span>
                        <span className="mx-2">·</span>
                        <span>{comment.timeAgo}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}
