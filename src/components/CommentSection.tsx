"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
    _id: string;
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
    const [replyTargetId, setReplyTargetId] = useState<string | null>(null); // 답글 대상 ID
    const [newReply, setNewReply] = useState<string>("");
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null); // 열린 메뉴의 댓글 ID
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 댓글 가져오기
    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) throw new Error("로그인이 필요합니다.");

                const { data } = await axios.get(
                    `https://www.codin.co.kr/api/comments/post/${postId}`,
                    {
                        headers: { Authorization: token },
                    }
                );

                if (data.success) {
                    setComments(data.dataList || []);
                } else {
                    throw new Error(data.message || "댓글 로드 실패");
                }
            } catch (err: any) {
                setError(err.message || "API 호출 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    // 댓글 작성
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.post(
                `https://www.codin.co.kr/api/comments/${postId}`,
                { content: newComment },
                {
                    headers: { Authorization: token },
                }
            );

            if (data.success) {
                setComments((prev) => [data.data, ...prev]);
                setNewComment("");
            } else {
                throw new Error(data.message || "댓글 작성 실패");
            }
        } catch (err: any) {
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        }
    };

    // 대댓글 작성
    const handleReplySubmit = async () => {
        if (!newReply.trim() || !replyTargetId) return;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.post(
                `https://www.codin.co.kr/api/replies/${replyTargetId}`,
                { content: newReply },
                {
                    headers: { Authorization: token },
                }
            );

            if (data.success) {
                setComments((prev) =>
                    prev.map((comment) =>
                        comment._id === replyTargetId
                            ? { ...comment, replies: [...comment.replies, data.data] }
                            : {
                                ...comment,
                                replies: comment.replies.map((reply) =>
                                    reply._id === replyTargetId
                                        ? {
                                            ...reply,
                                            replies: [...reply.replies, data.data],
                                        }
                                        : reply
                                ),
                            }
                    )
                );
                setNewReply("");
                setReplyTargetId(null);
            } else {
                throw new Error(data.message || "대댓글 작성 실패");
            }
        } catch (err: any) {
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        }
    };

    const toggleMenu = (commentId: string) => {
        setMenuOpenId((prev) => (prev === commentId ? null : commentId));
    };

    const handleMenuAction = (action: string, commentId: string) => {
        if (action === "reply") {
            setReplyTargetId(commentId);
        }
        setMenuOpenId(null); // 메뉴 닫기
    };

    // 댓글 및 대댓글 렌더링
    const renderComments = (comments: Comment[], depth: number = 0) => (
        <ul>
            {comments.map((comment) => (
                <li
                    key={comment._id}
                    className={`border-b py-2 ${
                        depth > 0 ? "ml-6 pl-4 border-l-2 border-gray-200" : ""
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center mb-1">
                                <span className="font-semibold">익명</span>
                                <span className="text-sm text-gray-500 ml-2">· 9시간 전</span>
                            </div>
                            <p>{comment.content || "내용이 없습니다."}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                ❤️ {comment.likeCount} {comment.deleted && "(삭제됨)"}
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                className="text-gray-500 hover:text-gray-800"
                                onClick={() => toggleMenu(comment._id)}
                            >
                                ⋮
                            </button>
                            {menuOpenId === comment._id && (
                                <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-32 z-10">
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => handleMenuAction("reply", comment._id)}
                                    >
                                        답글 달기
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => alert("수정하기 클릭됨")}
                                    >
                                        수정하기
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => alert("삭제하기 클릭됨")}
                                    >
                                        삭제하기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {comment._id === replyTargetId && (
                        <div className="mt-2 ml-6">
                            <textarea
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="대댓글을 입력하세요"
                                className="w-full border p-2 rounded"
                            />
                            <button
                                onClick={handleReplySubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                            >
                                대댓글 등록
                            </button>
                        </div>
                    )}
                    {comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
                </li>
            ))}
        </ul>
    );

    if (loading) return <p>댓글을 불러오는 중입니다...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="relative mt-8 mb-20">
            <h3 className="text-lg font-semibold mb-4">댓글</h3>
            {renderComments(comments)}

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center space-x-2">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="flex-grow border p-2 rounded"
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
