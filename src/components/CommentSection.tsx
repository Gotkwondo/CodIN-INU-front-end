"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
    FaHeart,
    FaCheckCircle,
    FaPaperPlane,
    FaTimes, // 닫기(X) 아이콘
} from "react-icons/fa";

// chat API 불러오기
import { startChat } from "@/api/postChatRoom";

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
    postName?: string;
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
        {/* 익명 토글 버튼 */}
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

        {/* 입력창 */}
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-grow bg-transparent text-sm outline-none placeholder-gray-400"
        />

        {/* 전송 버튼 */}
        <button
            onClick={onSubmit}
            className="ml-2 text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200 rounded-full p-2 disabled:opacity-50"
            disabled={submitLoading}
        >
            <FaPaperPlane className="h-5 w-5" />
        </button>
    </div>
);

export default function CommentSection({ postId, postName }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");

    // 수정 모드
    const [editCommentId, setEditCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState<string>("");

    // 현재 로그인된 사용자 ID
    const [currentUserId, setCurrentUserId] = useState<string>("");

    // 대댓글 작성
    const [newReply, setNewReply] = useState<string>("");
    const [replyTargetId, setReplyTargetId] = useState<string | null>(null);

    // 메뉴 관련
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // 로딩, 에러, 성공 메시지
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // 익명 댓글
    const [anonymous, setAnonymous] = useState<boolean>(true);

    // 삭제 모달
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // (추가) 댓글 입력창 열림/닫힘 상태
    const [showCommentInput, setShowCommentInput] = useState<boolean>(true);

    // 좋아요 토글 함수
    const toggleLike = async (likeType: string, id: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            // 요청 데이터
            const requestData = {
                likeType, // 예: "POST", "COMMENT", "REPLY" 등
                id,       // 댓글 또는 대댓글의 고유 ID
            };

            const { data } = await axios.post(
                "https://www.codin.co.kr/api/likes",
                requestData,
                { headers: { Authorization: token } }
            );

            if (data.success) {
                console.log("좋아요 토글 성공:", data);
                return true;
            } else {
                throw new Error(data.message || "좋아요 토글 실패");
            }
        } catch (error: any) {
            console.error("좋아요 토글 오류:", error.message);
            console.error("전송한 데이터:", { likeType, id });
            return false;
        }
    };

    // 댓글 목록 불러오기
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

    // 현재 사용자 정보 불러오기
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

    // 댓글 작성
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

    // 댓글 수정
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

    // 댓글 삭제
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

    // 대댓글 작성
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

    // 마운트 시 사용자, 댓글 데이터 가져오기
    useEffect(() => {
        fetchCurrentUser();
        fetchComments();
    }, [postId]);

    // 메뉴 바깥 클릭 시 닫기
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

    // 메뉴 열고/닫기
    const toggleMenu = (commentId: string) => {
        setMenuOpenId((prevId) => (prevId === commentId ? null : commentId));
    };

    // 삭제 모달 렌더링
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

    // 댓글(대댓글) 재귀 렌더링
    const renderComments = (commentList: Comment[], depth = 0) => (
        <ul>
            {commentList.map((comment) => (
                <li
                    key={comment._id}
                    className={`py-4 ${
                        depth > 0
                            ? "ml-6 pl-4 border-l-2 border-gray-200 bg-gray-50 rounded"
                            : "border-b border-gray-200"
                    }`}
                >
                    {/* 상단 영역 */}
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

                            {/* 삭제된 댓글인지, 수정 모드인지, 일반 상태인지 분기 */}
                            {comment.deleted ? (
                                <p className="text-gray-400 italic text-sm">
                                    (삭제된 댓글입니다)
                                </p>
                            ) : editCommentId === comment._id ? (
                                // 수정 모드
                                <div className="p-4 bg-white border border-gray-200 rounded shadow-sm mt-2 relative">
                                    <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      댓글 수정
                    </span>
                                        <button
                                            className="text-gray-400 hover:text-gray-600"
                                            onClick={() => {
                                                setEditCommentId(null);
                                                setEditContent("");
                                            }}
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    </div>
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
                                // 평소 상태
                                <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                            )}

                            {/* 좋아요 수 */}
                            <div className="flex items-center text-xs text-gray-500 mb-2">
                                <button
                                    onClick={async () => {
                                        const success = await toggleLike("POST", comment._id);
                                        if (success) {
                                            setComments((prevComments) =>
                                                prevComments.map((item) =>
                                                    item._id === comment._id
                                                        ? {
                                                            ...item,
                                                            isLiked: !item.isLiked,
                                                            likeCount: item.isLiked
                                                                ? item.likeCount - 1
                                                                : item.likeCount + 1,
                                                        }
                                                        : item
                                                )
                                            );
                                        }
                                    }}
                                >
                                    <FaHeart
                                        className={
                                            comment.isLiked ? "text-red-500 mr-2" : "text-gray-500 mr-2"
                                        }
                                    />
                                </button>
                                {comment.likeCount}
                            </div>
                        </div>

                        {/* 메뉴 버튼: 삭제된 댓글이라면 표시 X */}
                        {!comment.deleted && (
                            <div
                                className="relative"
                                ref={(el) => {
                                    if (el) menuRefs.current.set(comment._id, el);
                                }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(comment._id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ⋮
                                </button>
                                {menuOpenId === comment._id && (
                                    <div
                                        className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg w-32 z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* 답글 달기 */}
                                        <button
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                            onClick={() => {
                                                setReplyTargetId(comment._id);
                                                setMenuOpenId(null);
                                            }}
                                        >
                                            답글 달기
                                        </button>

                                        {/* 1) 내 댓글이라면 수정/삭제 */}
                                        {currentUserId === comment.userId ? (
                                            <>
                                                <button
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                                    onClick={() => {
                                                        setEditCommentId(comment._id);
                                                        setEditContent(comment.content || "");
                                                        setMenuOpenId(null);
                                                    }}
                                                >
                                                    수정하기
                                                </button>
                                                <button
                                                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 text-sm"
                                                    onClick={() => {
                                                        setIsModalOpen(true);
                                                        setDeleteTargetId(comment._id);
                                                        setMenuOpenId(null);
                                                    }}
                                                >
                                                    삭제하기
                                                </button>
                                            </>
                                        ) : (
                                            /* 2) 내 댓글이 아니라면 채팅하기 버튼 */
                                            <button
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                                onClick={async () => {
                                                    try {
                                                        // 필요한 제목(title)은 원하는 대로 지정 가능
                                                        await startChat("채팅방 제목", comment.userId);
                                                        setMenuOpenId(null);
                                                    } catch (error) {
                                                        console.error("채팅 오류:", error);
                                                    }
                                                }}
                                            >
                                                채팅하기
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 대댓글 작성 인풋창(현재 댓글에 답글 달기 클릭 시) */}
                    {replyTargetId === comment._id && (
                        <div className="p-4 mt-3 bg-white border border-gray-200 rounded shadow-sm relative">
                            {/* 상단 헤더: "답글 입력" & 닫기 버튼(X) */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">답글 입력</span>
                                <button
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={() => {
                                        setReplyTargetId(null);
                                        setNewReply("");
                                    }}
                                >
                                    <FaTimes className="h-4 w-4" />
                                </button>
                            </div>
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

                    {/* 재귀적으로 대댓글 렌더링 */}
                    {comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="relative mt-8 mb-28 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                댓글
                {/* {postName && <span> - {postName}</span>} */}
            </h3>

            {/* 에러 메시지 */}
            {error && <p className="text-red-500 mb-2">{error}</p>}

            {/* 댓글 목록 */}
            {renderComments(comments)}

            {/* 삭제 모달 */}
            {renderDeleteModal()}

            {/* (추가) 댓글 작성 인풋창: showCommentInput이 true일 때만 보임 */}
            {showCommentInput && (
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md border-t border-gray-200">
                    <div className="max-w-2xl mx-auto relative">

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
            )}
        </div>
    );
}
