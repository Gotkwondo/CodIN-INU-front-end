// D:\IdeaProjects\front-end\src\app\(auth-required)\main\boards\[boardName]\[postId]\page.tsx
"use client";

import { useEffect, useState } from "react";
import { Post } from "@/interfaces/Post";
import apiClient from "@/api/clients/apiClient"; // 공통 apiClient 불러오기
import CommentSection from "@/components/board/CommentSection";
import ZoomableImageModal from "@/components/modals/ZoomableImageModal";
import { FaEye, FaHeart, FaRegCommentDots, FaBookmark } from "react-icons/fa";

interface PostDetailClientProps {
    postId: string;
}

export default function PostDetailClient({ postId }: PostDetailClientProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 게시물 데이터를 가져오는 함수
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/posts/${postId}`);
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

    // 좋아요 및 북마크 토글 함수
    const toggleAction = async (action: "like" | "bookmark") => {
        try {
            // API 요청 URL 및 데이터 설정
            const url = action === "like" ? "/likes" : `/scraps/${postId}`;
            const requestData =
                action === "like" ? { likeType: "POST", id: post?._id } : undefined;

            // API 호출
            const response = await apiClient.post(url, requestData);

            if (response.data.success && post) {
                setPost({
                    ...post,
                    userInfo: {
                        ...post.userInfo,
                        [action === "like" ? "like" : "scrap"]: !post.userInfo[action === "like" ? "like" : "scrap"],
                    },
                    likeCount:
                        action === "like"
                            ? post.userInfo.like
                                ? post.likeCount - 1
                                : post.likeCount + 1
                            : post.likeCount,
                    scrapCount:
                        action === "bookmark"
                            ? post.userInfo.scrap
                                ? post.scrapCount - 1
                                : post.scrapCount + 1
                            : post.scrapCount,
                });
            } else {
                console.error(response.data.message || `${action === "like" ? "좋아요" : "북마크"} 실패`);
            }
        } catch (error) {
            console.error(`${action === "like" ? "좋아요" : "북마크"} 토글 실패`, error);
        }
    };

    // 로딩 상태 표시
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">로딩 중...</h2>
            </div>
        );
    }

    // 에러 상태 표시
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">{error}</h2>
            </div>
        );
    }

    // 게시물이 없는 경우 처리
    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">게시물을 찾을 수 없습니다.</h2>
            </div>
        );
    }

    // 렌더링
    return (
        <div className="bg-white min-h-screen p-1">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {post.anonymous ? (
                        <img
                            src="/images/anonymousUserImage.png" // 정적 경로의 익명 이미지
                            alt="Anonymous profile"
                            className="w-full h-full object-cover"
                        />
                    ) : post.userImageUrl ? (
                        <img
                            src={post.userImageUrl}
                            alt="User profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-600 text-sm">No Image</span>
                    )}
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-gray-800">
                        {post.anonymous ? "익명" : post.nickname || "익명"}
                    </h4>
                    <p className="text-xs text-gray-500">{post.createdAt}</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 pb-3">{post.title}</h3>
                <p className="text-gray-800 text-base">{post.content}</p>
            </div>
            {post.postImageUrl && post.postImageUrl.length > 0 && (
                <ZoomableImageModal images={post.postImageUrl} />
            )}
            <div className="flex items-center justify-between text-gray-500 text-sm border-t border-b py-2 mb-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <FaEye className="w-5 h-5" />
                        <span>{post.viewCount || 0}</span>
                    </div>
                    <button onClick={() => toggleAction("like")} className="flex items-center space-x-1">
                        <FaHeart className={`w-5 h-5 ${post.userInfo.like ? "text-red-500" : "text-gray-500"}`} />
                        <span>{post.likeCount}</span>
                    </button>

                    <div className="flex items-center space-x-1">
                        <FaRegCommentDots className="w-5 h-5" />
                        <span>{post.commentCount}</span>
                    </div>
                </div>
                <button onClick={() => toggleAction("bookmark")} className="flex items-center space-x-1">
                    <FaBookmark className={`w-5 h-5 ${post.userInfo.scrap ? "text-yellow-300" : "text-gray-500"}`} />
                    <span>{post.scrapCount}</span>
                </button>

            </div>
            <CommentSection postId={postId} postName={post.title} />
        </div>
    );
}
