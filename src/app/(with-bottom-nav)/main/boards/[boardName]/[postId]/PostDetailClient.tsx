//src/app/(with-bottom-nav)/main/boards/[boardName]/[postId]/PostDetailClient.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Post } from "@/interfaces/Post";
import CommentSection from "@/components/CommentSection"; // 댓글 섹션 컴포넌트 import
import Image from "next/image";

interface PostDetailClientProps {
    postId: string;
}

export default function PostDetailClient({ postId }: PostDetailClientProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalImage, setModalImage] = useState<string | null>(null); // 모달 이미지 상태

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

    const handleLike = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("토큰이 없습니다.");
                return;
            }

            await axios.post(
                `https://www.codin.co.kr/api/likes`,
                { likeType: "POST", id: postId },
                {
                    headers: { Authorization: token },
                }
            );
            console.log("좋아요 추가 완료");
        } catch (error) {
            console.error("좋아요 추가 실패", error);
        }
    };

    const handleScrap = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("토큰이 없습니다.");
                return;
            }

            await axios.post(
                `https://www.codin.co.kr/api/scraps/${postId}`,
                {},
                {
                    headers: { Authorization: token },
                }
            );
            console.log("스크랩 추가 완료");
        } catch (error) {
            console.error("스크랩 추가 실패", error);
        }
    };

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

            {/* 이미지 리스트 섹션 */}
            {post.postImageUrl && post.postImageUrl.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">이미지</h3>
                    <div className="flex overflow-x-auto space-x-4 p-2 border rounded bg-gray-100">
                        {post.postImageUrl.map((imageUrl, index) => (
                            <div
                                key={index}
                                className="relative w-32 h-32 flex-shrink-0 cursor-pointer"
                                onClick={() => setModalImage(imageUrl)}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={`Post image ${index}`}
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full rounded"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 버튼 섹션 */}
            <div className="flex space-x-4 mb-8">
                <button
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleLike}
                >
                    ❤️ 좋아요
                </button>
                <button
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={handleScrap}
                >
                    ⭐ 스크랩
                </button>
                <button
                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => navigator.share && navigator.share({ title: post.title, url: window.location.href })}
                >
                    🔗 공유하기
                </button>
            </div>

            {/* 모달 */}
            {modalImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative w-auto max-w-3xl">
                        <Image
                            src={modalImage}
                            alt="Modal Image"
                            width={800}
                            height={800}
                            className="object-contain rounded"
                        />
                        <button
                            className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow"
                            onClick={() => setModalImage(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* 댓글 섹션 추가 */}
            <CommentSection postId={postId} />
        </div>
    );
}
