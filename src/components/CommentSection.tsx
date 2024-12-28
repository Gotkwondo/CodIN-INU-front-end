"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaCheckCircle, FaPaperPlane } from "react-icons/fa";

interface Comment {
    _id: string;
    userId: string;
    nickname: string;
    anonymous: boolean;
    content: string | null;
    likeCount: number;
    isLiked?: boolean;
    deleted: boolean;
    replies: Comment[];
    createdAt: string;
    updatedAt?: string;
}

interface CommentSectionProps {
    postId: string;
}

const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "방금 전";
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}시간 전`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}일 전`;
    }
};

const CommentInput = ({
                          anonymous,
                          setAnonymous,
                          value,
                          onChange,
                          onSubmit,
                          submitLoading,
                          placeholder,
                      }: {
    anonymous: boolean;
    setAnonymous: (value: (prev: boolean) => boolean) => void;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    submitLoading: boolean;
    placeholder: string;
}) => (
    <div className="flex items-center bg-gray-200 border rounded-full shadow py-0.5 px-3 ">
        <button
            onClick={() => setAnonymous((prev) => !prev)}
            className="flex items-center space-x-2 focus:outline-none"
        >
            <FaCheckCircle
                className={`h-5 w-5 ${
                    anonymous ? "text-blue-500" : "text-gray-400"
                }`}
            />
            <span
                className={`text-sm font-medium ${
                    anonymous ? "text-blue-500" : "text-gray-500"
                }`}
            >
                익명
            </span>
        </button>
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-grow bg-transparent ml-4 text-sm outline-none placeholder-gray-500"
        />
        <button
            onClick={onSubmit}
            className="text-blue-500 hover:text-blue-600 p-2 disabled:opacity-50"
            disabled={submitLoading}
        >
            <FaPaperPlane className="h-6 w-6" />
        </button>
    </div>
);

export default function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [editCommentId, setEditCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [newReply, setNewReply] = useState<string>("");
    const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [anonymous, setAnonymous] = useState<boolean | null>(true);

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
                const validComments = (data.dataList || []).map((comment: Comment) => ({
                    ...comment,
                    content: comment.content || "내용이 없습니다.",
                }));
                setComments(validComments);
            } else {
                throw new Error(data.message || "댓글 로드 실패");
            }
        } catch (err: any) {
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const submitComment = async (content: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.post(
                `https://www.codin.co.kr/api/comments/${postId}`,
                { content },
                {
                    headers: { Authorization: token },
                }
            );

            if (data.success) {
                fetchComments();
                setNewComment("");
                setSuccessMessage(data.message || "댓글이 추가되었습니다.");
                setTimeout(() => setSuccessMessage(null), 2000);
            } else {
                throw new Error(data.message || "댓글 작성 실패");
            }
        } catch (err: any) {
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        } finally {
            setSubmitLoading(false);
        }
    };

    const updateComment = async (commentId: string, content: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.patch(
                `https://www.codin.co.kr/api/comments/${commentId}`,
                { content },
                {
                    headers: { Authorization: token },
                }
            );

            if (data.success) {
                fetchComments();
                setEditCommentId(null);
                setEditContent("");
                setSuccessMessage("댓글이 수정되었습니다.");
                setTimeout(() => setSuccessMessage(null), 2000);
            } else {
                throw new Error(data.message || "댓글 수정 실패");
            }
        } catch (err: any) {
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.delete(
                `https://www.codin.co.kr/api/comments/${commentId}`,
                {
                    headers: { Authorization: token },
                }
            );

            if (data.success) {
                fetchComments();
                setSuccessMessage("댓글이 삭제되었습니다.");
                setTimeout(() => setSuccessMessage(null), 2000);
            } else {
                throw new Error(data.message || "댓글 삭제 실패");
            }
        } catch (err: any) {
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        }
    };

    const updateReply = async (replyId: string, content: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.patch(
                `https://www.codin.co.kr/api/replies/${replyId}`,
                { content },
                {
                    headers: { Authorization: token },
                }
            );

            if (data.success) {
                fetchComments();
                setReplyTargetId(null);
                setNewReply("");
                setSuccessMessage("대댓글이 수정되었습니다.");
                setTimeout(() => setSuccessMessage(null), 2000);
            } else {
                throw new Error(data.message || "대댓글 수정 실패");
            }
        } catch (err: any) {
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        }
    };

    const deleteReply = async (replyId: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.delete(
                `https://www.codin.co.kr/api/replies/${replyId}`,
                {
                    headers: { Authorization: token },
                }
            );

            if (data.success) {
                fetchComments();
                setSuccessMessage("대댓글이 삭제되었습니다.");
                setTimeout(() => setSuccessMessage(null), 2000);
            } else {
                throw new Error(data.message || "대댓글 삭제 실패");
            }
        } catch (err: any) {
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        }
    };

    const submitReply = async (content: string, commentId: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.post(
                `https://www.codin.co.kr/api/replies/${commentId}`,
                { content, anonymous },
                {
                    headers: { Authorization: token },
                }
            );

            if (data.success) {
                fetchComments();
                setNewReply("");
                setReplyTargetId(null);
                setSuccessMessage("대댓글이 추가되었습니다.");
                setTimeout(() => setSuccessMessage(null), 2000);
            } else {
                throw new Error(data.message || "대댓글 작성 실패");
            }
        } catch (err: any) {
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        } finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const renderComments = (comments: Comment[], depth: number = 0) => (
        <ul>
            {comments.map((comment) => (
                comment.deleted? null : (
                <li
                    key={comment._id}
                    className={`border-b py-4 ${
                        depth > 0 ? "ml-6 pl-4 border-l-2 border-gray-300" : ""
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center mb-1">
                                <span className="font-semibold text-gray-800">{comment.nickname || "익명"}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                    · {timeAgo(comment.createdAt)}
                                </span>
                            </div>
                            {editCommentId === comment._id ? (
                                <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
                                    <CommentInput
                                        anonymous={anonymous}
                                        setAnonymous={setAnonymous}
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        onSubmit={() => updateComment(comment._id, editContent)}
                                        submitLoading={submitLoading}
                                        placeholder="댓글을 수정하세요"
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-700">{comment.content}</p>
                            )}
                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                <FaHeart className="text-red-500 mr-1" /> {comment.likeCount}
                                {comment.deleted && " (삭제됨)"}
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                className="text-gray-500 hover:text-gray-800"
                                onClick={() => setMenuOpenId(menuOpenId === comment._id ? null : comment._id)}
                            >
                                ⋮
                            </button>
                            {menuOpenId === comment._id && (
                                <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-32 z-10">
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => setReplyTargetId(comment._id)}
                                    >
                                        답글 달기
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setEditCommentId(comment._id);
                                            setEditContent(comment.content || "");
                                        }}
                                    >
                                        수정하기
                                    </button>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => deleteComment(comment._id)}
                                    >
                                        삭제하기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {replyTargetId === comment._id && (
                        <div className="p-4 bg-gray-50 border rounded-lg shadow-sm">
                            <CommentInput
                                anonymous={anonymous}
                                setAnonymous={setAnonymous}
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                onSubmit={() => submitReply(newReply, comment._id)}
                                submitLoading={submitLoading}
                                placeholder="답글을 입력하세요"
                            />
                        </div>
                    )}
                    {comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
                </li>)
            ))}
        </ul>
    );

    return (
        <div className="relative mt-8 mb-20">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">댓글</h3>
            {error && <p className="text-red-500">{error}</p>}
            {renderComments(comments)}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 space-x-2 shadow-md border-t">
                <CommentInput
                    anonymous={anonymous}
                    setAnonymous={setAnonymous}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onSubmit={() => submitComment(newComment)}
                    submitLoading={submitLoading}
                    placeholder="댓글을 입력하세요"
                />
            </div>
        </div>
    );
}
