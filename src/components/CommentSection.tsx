"use client";

import { useEffect, useState, useRef } from "react";
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

interface ApiResponse {
    success: boolean;
    message?: string;
    dataList?: Comment[];
}

const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "방금 전";
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else {
        return `${Math.floor(diffInSeconds / 86400)}일 전`;
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
    <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full py-1 px-2">
        <button
            onClick={() => setAnonymous((prev) => !prev)}
            className="flex items-center space-x-1 focus:outline-none mr-2"
        >
            <FaCheckCircle
                className={`h-5 w-5 ${anonymous ? "text-blue-500" : "text-gray-400"}`}
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
            className="flex-grow bg-transparent text-sm outline-none placeholder-gray-400"
        />
        <button
            onClick={onSubmit}
            className="ml-2 text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 rounded-full p-2 disabled:opacity-50"
            disabled={submitLoading}
        >
            <FaPaperPlane className="h-5 w-5" />
        </button>
    </div>
);

export default function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [editCommentId, setEditCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState<string>("");
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [newReply, setNewReply] = useState<string>("");
    const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [anonymous, setAnonymous] = useState<boolean>(true);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const fetchComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.get<ApiResponse>(
                `https://www.codin.co.kr/api/comments/post/${postId}`,
                { headers: { Authorization: token } }
            );

            if (data.success) {
                const validComments = (data.dataList || []).map((comment) => ({
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

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.get("https://www.codin.co.kr/api/users", {
                headers: { Authorization: token },
            });

            if (data.success) {
                setCurrentUserId(data.data._id);
            } else {
                throw new Error("사용자 정보를 가져오지 못했습니다.");
            }
        } catch (err: any) {
            console.error("사용자 정보 호출 오류:", err.message);
        }
    };

    const submitComment = async (content: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            setSubmitLoading(true);
            const { data } = await axios.post(
                `https://www.codin.co.kr/api/comments/${postId}`,
                { content, anonymous },
                { headers: { Authorization: token } }
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
                { headers: { Authorization: token } }
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
                { headers: { Authorization: token } }
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

    const submitReply = async (content: string, commentId: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            setSubmitLoading(true);
            const { data } = await axios.post(
                `https://www.codin.co.kr/api/replies/${commentId}`,
                { content, anonymous },
                { headers: { Authorization: token } }
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
        fetchCurrentUser();
        fetchComments();
    }, [postId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            for (const [id, ref] of menuRefs.current.entries()) {
                if (ref && !ref.contains(event.target as Node)) {
                    setMenuOpenId((prevId) => (prevId === id ? null : prevId));
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = (commentId: string) => {
        setMenuOpenId((prevId) => (prevId === commentId ? null : commentId));
    };

    const renderDeleteModal = () =>
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                    <p className="text-gray-800 text-lg font-semibold mb-4">
                        댓글을 삭제하시겠습니까?
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                            onClick={() => setIsModalOpen(false)}
                        >
                            취소
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                            onClick={() => {
                                if (deleteTargetId) deleteComment(deleteTargetId);
                                setIsModalOpen(false);
                            }}
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        );

    const renderComments = (comments: Comment[], depth: number = 0) => (
        <ul>
            {comments.map((comment) =>
                comment.deleted ? null : (
                    <li
                        key={comment._id}
                        className={`py-4 ${
                            depth > 0
                                ? "ml-6 pl-4 border-l-2 border-gray-200 bg-gray-50 rounded"
                                : "border-b border-gray-200"
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="pr-2 w-full">
                                {/* 닉네임 & 작성 시간 */}
                                <div className="flex items-center mb-1">
                  <span className="font-semibold text-gray-800 text-sm">
                    {comment.anonymous ? "익명" : comment.nickname}
                  </span>
                                    <span className="text-xs text-gray-500 ml-2">
                    · {timeAgo(comment.createdAt)}
                  </span>
                                </div>

                                {/* 댓글/대댓글 수정 인풋 */}
                                {editCommentId === comment._id ? (
                                    <div className="p-4 bg-white border border-gray-200 rounded shadow-sm">
                                        <CommentInput
                                            anonymous={anonymous}
                                            setAnonymous={setAnonymous}
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            onSubmit={() => updateComment(comment._id, editContent)}
                                            submitLoading={submitLoading}
                                            placeholder="댓글을 수정하세요"
                                        />
                                        {/* 닫기 버튼 (댓글/대댓글 수정창) */}
                                        <button
                                            className="mt-2 px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors duration-200"
                                            onClick={() => {
                                                setEditCommentId(null);
                                                setEditContent("");
                                            }}
                                        >
                                            닫기
                                        </button>
                                    </div>
                                ) : (
                                    // 평소 상태
                                    <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                                )}

                                {/* 좋아요 수 */}
                                <div className="flex items-center text-xs text-gray-500">
                                    <FaHeart className="text-red-500 mr-1" /> {comment.likeCount}
                                    {comment.deleted && " (삭제됨)"}
                                </div>
                            </div>

                            {/* 메뉴 버튼 */}
                            <div
                                ref={(el) => menuRefs.current.set(comment._id, el!)}
                                className="relative"
                            >
                                <button
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(comment._id);
                                    }}
                                >
                                    ⋮
                                </button>
                                {menuOpenId === comment._id && (
                                    <div
                                        className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg w-32 z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                            onClick={() => {
                                                setReplyTargetId(comment._id);
                                                setMenuOpenId(null); // 메뉴 닫기
                                            }}
                                        >
                                            답글 달기
                                        </button>
                                        {currentUserId === comment.userId && (
                                            <>
                                                <button
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                                    onClick={() => {
                                                        setEditCommentId(comment._id);
                                                        setEditContent(comment.content || "");
                                                        setMenuOpenId(null); // 메뉴 닫기
                                                    }}
                                                >
                                                    수정하기
                                                </button>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 text-sm"
                                                    onClick={() => {
                                                        setIsModalOpen(true);
                                                        setDeleteTargetId(comment._id);
                                                        setMenuOpenId(null); // 메뉴 닫기
                                                    }}
                                                >
                                                    삭제하기
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 대댓글 달기 인풋창 */}
                        {replyTargetId === comment._id && (
                            <div className="p-4 mt-3 bg-white border border-gray-200 rounded shadow-sm">
                                <CommentInput
                                    anonymous={anonymous}
                                    setAnonymous={setAnonymous}
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    onSubmit={() => submitReply(newReply, comment._id)}
                                    submitLoading={submitLoading}
                                    placeholder="답글을 입력하세요"
                                />
                                {/* 닫기 버튼 (대댓글 달기창) */}
                                <button
                                    className="mt-2 px-3 py-1 bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors duration-200"
                                    onClick={() => {
                                        setReplyTargetId(null);
                                        setNewReply("");
                                    }}
                                >
                                    닫기
                                </button>
                            </div>
                        )}

                        {/* 재귀적으로 대댓글 렌더링 */}
                        {comment.replies.length > 0 &&
                            renderComments(comment.replies, depth + 1)}
                    </li>
                )
            )}
        </ul>
    );

    return (
        <div className="relative mt-8 mb-28 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">댓글</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {renderComments(comments)}
            {renderDeleteModal()}

            {/* 댓글 작성 인풋창(화면 하단 고정) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md border-t border-gray-200">
                <div className="max-w-2xl mx-auto">
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
        </div>
    );
}
