"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Post } from "@/interfaces/Post";
import CommentSection from "@/components/CommentSection"; // 댓글 섹션 컴포넌트 import

interface PostDetailClientProps {
    postId: string;
}

export default function PostDetailClient({ postId }: PostDetailClientProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setError("로그인이 필요합니다.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`https://www.codin.co.kr/api/posts/${postId}`, {
                    headers: {
                        Authorization: token,
                    },
                });

                if (response.data.success) {
                    setPost(response.data.data);
                } else {
                    setError(response.data.message || "게시물 로드 실패");
                }
            } catch (err) {
                console.error("API 호출 오류:", err);
                setError("API 호출 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">로딩 중...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">{error}</h2>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">게시물을 찾을 수 없습니다.</h2>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen p-4 pb-16">
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                    <span>❤️ {post.likeCount}</span>
                    <span>💬 {post.commentCount}</span>
                    <span>⭐ {post.scrapCount}</span>
                    <span>{post.createdAt}</span>
                </div>
            </header>
            <article className="prose mb-8 text-black">
                <p>{post.content}</p>
            </article>
            {/* 댓글 섹션 추가 */}
            <CommentSection postId={postId} />
        </div>
    );
}
