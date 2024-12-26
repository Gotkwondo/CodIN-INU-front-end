"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
    commentId: string;
    userId: string;
    content: string | null;
    likeCount: number;
    deleted: boolean;
    replies: Comment[];
}

interface CommentSectionProps {
    postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
    const [newReply, setNewReply] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setError("로그인이 필요합니다.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `https://www.codin.co.kr/api/comments/post/${postId}`,
                    {
                        headers: { Authorization: token },
                    }
                );

                if (response.data.success) {
                    setComments(response.data.dataList || []);
                } else {
                    setError(response.data.message || "댓글 로드 실패");
                }
            } catch (err) {
                console.error("API 호출 오류:", err);
                setError("API 호출 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setError("로그인이 필요합니다.");
                return;
            }

            const response = await axios.post(
                `https://www.codin.co.kr/api/comments/${postId}`,
                { content: newComment },
                {
                    headers: { Authorization: token },
                }
            );

            if (response.data.success) {
                const newCommentData: Comment = response.data.data;
                setComments((prev) => [newCommentData, ...prev]);
                setNewComment("");
            } else {
                setError(response.data.message || "댓글 작성 실패");
            }
        } catch (err) {
            console.error("API 호출 오류:", err);
            setError("API 호출 중 오류가 발생했습니다.");
        }
    };

    const handleReplySubmit = async () => {
        if (!newReply.trim() || !replyCommentId) return;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setError("로그인이 필요합니다.");
                return;
            }

            const response = await axios.post(
                `https://www.codin.co.kr/api/replies/${replyCommentId}`,
                { content: newReply },
                {
                    headers: { Authorization: token },
                }
            );

            if (response.data.success) {
                const newReplyData: Comment = response.data.data;
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.commentId === replyCommentId
                            ? {
                                ...comment,
                                replies: [newReplyData, ...comment.replies],
                            }
                            : comment
                    )
                );
                setNewReply("");
                setReplyCommentId(null);
            } else {
                setError(response.data.message || "대댓글 작성 실패");
            }
        } catch (err) {
            console.error("API 호출 오류:", err);
            setError("API 호출 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <p>댓글을 불러오는 중입니다...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="relative mt-8">
            <h3 className="text-lg font-semibold mb-4">댓글</h3>
            <ul className="mb-20">
                {comments.map((comment) => (
                    <li key={comment.commentId} className="border-b py-2">
                        <div className="text-black">
                            <div className="flex items-center mb-1">
                                <span className="font-semibold">익명</span>
                                <span className="text-sm text-gray-500 ml-2">· 9시간 전</span>
                            </div>
                            <p>{comment.content || "내용이 없습니다."}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                ❤️ {comment.likeCount} {comment.deleted && "(삭제됨)"}
                                <button
                                    onClick={() => setReplyCommentId(comment.commentId)}
                                    className="ml-4 text-blue-500"
                                >
                                    답글 달기
                                </button>
                            </div>
                        </div>
                        {comment.commentId === replyCommentId && (
                            <div className="mt-2 ml-6">
                                <textarea
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    placeholder="대댓글을 입력하세요"
                                    className="w-full border p-2 rounded text-black"
                                />
                                <button
                                    onClick={handleReplySubmit}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                >
                                    대댓글 등록
                                </button>
                            </div>
                        )}
                        <ul className="mt-2 ml-6">
                            {comment.replies?.map((reply) => (
                                <li key={reply.commentId} className="border-b py-2">
                                    <div className="flex items-center mb-1">
                                        <span className="font-semibold">익명</span>
                                        <span className="text-sm text-gray-500 ml-2">· 9시간 전</span>
                                    </div>
                                    <p className="text-black">{reply.content || "내용이 없습니다."}</p>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        ❤️ {reply.likeCount} {reply.deleted && "(삭제됨)"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            {/* 입력창 섹션 */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center space-x-2">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="flex-grow border p-2 rounded text-black"
                />
                <button
                    onClick={handleCommentSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    등록
                </button>
            </div>
        </div>
    );
}
