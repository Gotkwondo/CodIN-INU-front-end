"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Post } from "@/interfaces/Post";
import CommentSection from "@/components/CommentSection";
import { FaEye, FaHeart, FaRegCommentDots, FaBookmark } from "react-icons/fa";
import CustomZoomImage from "@/components/ZoomableImageModal";
import ZoomableImageModal from "@/components/ZoomableImageModal";

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

                    window.location.href = "/login"; // 로그인 페이지로 리다이렉트
                    setLoading(false);
                    return;
                }



                const response = await axios.get(`https://www.codin.co.kr/api/posts/${postId}`, {
                    headers: {
                        Authorization: token,
                    },
                });

                console.log("Response Data:", response.data); // 응답 데이터 콘솔 출력

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



    const toggleAction = async (action: "like" | "bookmark") => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("토큰이 없습니다.");
                return;
            }

            let url = "";
            let method = post?.[action === "like" ? "isLiked" : "isBookmarked"] ? "DELETE" : "POST";
            let data = {};

            if (action === "like") {
                url = "https://www.codin.co.kr/api/likes";
                data = { likeType: "POST", id: postId };
            } else if (action === "bookmark") {
                url = `https://www.codin.co.kr/api/scraps/${postId}`;
            }

            await axios({
                method,
                url,
                data,
                headers: { Authorization: token },
            });

            if (post) {
                setPost({
                    ...post,
                    [action === "like" ? "isLiked" : "isBookmarked"]: !post[action === "like" ? "isLiked" : "isBookmarked"],
                    likeCount:
                        action === "like"
                            ? post.isLiked
                                ? post.likeCount - 1
                                : post.likeCount + 1
                            : post.likeCount,
                });
            }
        } catch (error) {
            console.error(`${action === "like" ? "좋아요" : "북마크"} 토글 실패`, error);
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
        <div className="bg-white min-h-screen p-4">
            {/* 헤더 섹션 */}
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-sm">익명</span>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-800">{post.authorName || "익명"}</h4>
                    <p className="text-xs text-gray-500">{post.createdAt}</p>
                </div>
            </div>

            {/* 본문 섹션 */}
            <div className="mb-4">
                <p className="text-gray-800 text-base">{post.content}</p>
            </div>

            {/* 이미지 섹션 */}
            {post.postImageUrl && post.postImageUrl.length > 0 && (
                <ZoomableImageModal images={post.postImageUrl} />

            )}

            {/* 액션 섹션 */}
            <div className="flex items-center justify-between text-gray-500 text-sm border-t border-b py-2 mb-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <FaEye className="w-5 h-5" />
                        <span>{post.viewCount}</span>
                    </div>
                    <button onClick={() => toggleAction("like")} className="flex items-center space-x-1">
                        <FaHeart className={`w-5 h-5 ${post.isLiked ? "text-red-500" : "text-gray-500"}`} />
                        <span>{post.likeCount}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                        <FaRegCommentDots className="w-5 h-5" />
                        <span>{post.commentCount}</span>
                    </div>
                </div>
                <button onClick={() => toggleAction("bookmark")} className="flex items-center space-x-1">
                    <FaBookmark className={`w-5 h-5 ${post.isBookmarked ? "text-green-500" : "text-gray-500"}`} />
                    <span>{post.isBookmarked ? 1 : 0}</span>
                </button>
            </div>

            {/* 댓글 섹션 */}
            <CommentSection postId={postId} />
        </div>
    );
}
