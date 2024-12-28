"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart,FaCheckCircle , FaPaperPlane } from "react-icons/fa";

interface Comment {
    _id: string; // 댓글 ID
    userId: string; // 작성자 ID
    nickname: string; // 작성자 닉네임
    anonymous: boolean; // 익명 여부
    content: string | null; // 댓글 내용
    likeCount: number; // 좋아요 수
    isLiked?: boolean; // 사용자가 좋아요를 눌렀는지 여부 (선택적)
    deleted: boolean; // 댓글 삭제 여부
    replies: Comment[]; // 대댓글 리스트
    createdAt: string; // 댓글 생성 시간
    updatedAt?: string; // 댓글 수정 시간 (선택적)
}

interface CommentSectionProps {
    postId: string;
}


const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "최근";
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

export default function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [newReply, setNewReply] = useState<string>(""); // 대댓글 상태
    const [replyTargetId, setReplyTargetId] = useState<string | null>(null); // 대댓글 타겟
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null); // 메뉴 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [submitLoading, setSubmitLoading] = useState(false); // 댓글 등록 버튼 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // 성공 메시지
    const [anonymous, setAnonymous] = useState<boolean | null>(true); // 성공 메시지

    const fetchComments = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("Fetching comments for postId:", postId);
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.get(
                `https://www.codin.co.kr/api/comments/post/${postId}`,
                {
                    headers: { Authorization: token },
                }
            );

            console.log("Fetched comments data:", data);

            if (data.success) {
                const validComments = (data.dataList || []).map((comment: Comment) => ({
                    ...comment,
                    content: comment.content || "내용이 없습니다.", // 기본값 추가
                }));
                console.log("Processed comments:", validComments);
                setComments(validComments);
            } else {
                throw new Error(data.message || "댓글 로드 실패");
            }
        } catch (err: any) {
            console.error("Error fetching comments:", err.message);
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };
    // 댓글 불러오기
    useEffect(() => {


        fetchComments();
    }, [postId]);

    // 댓글 작성
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;

        setSubmitLoading(true);
        setError(null); // 이전 에러 상태 초기화

        try {
            console.log("Submitting new comment:", newComment);
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.post(
                `https://www.codin.co.kr/api/comments/${postId}`,
                { content: newComment },
                {
                    headers: { Authorization: token },
                }
            );

            console.log("Comment submit response:", data);

            if (data.success) {
                // if (data.data) {

                    // console.log("Updated comments after adding new comment:", newComments);
                    // setComments(newComments);
                    setNewComment(""); // 입력창 초기화
                    setSuccessMessage(data.message || "댓글이 추가되었습니다."); // 백엔드 메시지 사용
                    setTimeout(() => setSuccessMessage(null), 2000); // 2초 후 메시지 제거
                    console.log("여기에 새로고침 입력")
                    fetchComments();
                // }
            } else {
                throw new Error(data.message || "댓글 작성 실패");
            }
        } catch (err: any) {
            console.error("Error submitting comment:", err.message);
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        } finally {
            setSubmitLoading(false);
        }
    };

    // 대댓글 작성
    const handleReplySubmit = async () => {
        if (!newReply.trim() || !replyTargetId) return;

        setSubmitLoading(true);
        setError(null);

        try {
            console.log("Submitting new reply:", newReply, "for target comment ID:", replyTargetId);
            const token = localStorage.getItem("accessToken");
            if (!token) throw new Error("로그인이 필요합니다.");

            const { data } = await axios.post(
                `https://www.codin.co.kr/api/replies/${replyTargetId}`,
                { content: newReply },
                {
                    headers: { Authorization: token },
                }
            );

            console.log("Reply submit response:", data);

            if (data.success && data.data) {
                const updatedComments = comments.map((comment) =>
                    comment._id === replyTargetId
                        ? {
                            ...comment,
                            replies: [
                                ...comment.replies,
                                {
                                    ...data.data,
                                    content: data.data.content || "내용이 없습니다.",
                                },
                            ],
                        }
                        : comment
                );
                console.log("Updated comments after adding reply:", updatedComments);
                setComments(updatedComments);
                setNewReply("");
                setReplyTargetId(null);
                setSuccessMessage("대댓글이 추가되었습니다.");
                setTimeout(() => setSuccessMessage(null), 2000); // 2초 후 메시지 제거
            } else {
                throw new Error(data.message || "대댓글 작성 실패");
            }
        } catch (err: any) {
            console.error("Error submitting reply:", err.message);
            setError(err.message || "API 호출 중 오류가 발생했습니다.");
        } finally {
            setSubmitLoading(false);
        }
    };


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
                                <span className="font-semibold">{comment.nickname || "익명"}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                · {timeAgo(comment.createdAt)}
                            </span>
                            </div>
                            <p>{comment.content}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
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
                                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                        수정하기
                                    </button>
                                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                        삭제하기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {comment.replies.length > 0 && renderComments(comment.replies, depth + 1)}
                </li>
            ))}
        </ul>
    );

    //if (loading) return <p>댓글을 불러오는 중입니다...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="relative mt-8 mb-20">
            <h3 className="text-lg font-semibold mb-4">댓글</h3>


            {/*성공 메세지 */}
            {/*{successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}*/}

            {/*댓글 표시부*/}
            {renderComments(comments)}

            {/*댓글 입력 부분*/}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 space-x-2 shadow border">
                <div className="rounded-full flex items-center bg-gray-200 pl-4 pr-4 py-0.5">
                    {/* 익명 토글 버튼 */}
                            <button
                                onClick={() => setAnonymous((prev) => !prev)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <FaCheckCircle
                                    className={`h-5 w-5 ${
                                        anonymous ? "text-blue-500" : "text-gray-400"
                                    } ${anonymous ? "fill-current" : "stroke-current"}`}
                                />
                                <span
                                    className={`text-sm font-medium ${
                                        anonymous ? "text-blue-500" : "text-gray-500"
                                    }`}
                                >
                        익명
                    </span>
                    </button>

                    {/* 댓글 입력 필드 */}
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        className="flex-grow bg-transparent ml-4 text-sm outline-none placeholder-gray-500"
                    />

                    {/* 전송 버튼 */}
                    <button
                        onClick={handleCommentSubmit}
                        className="text-blue-500 hover:text-blue-600 p-2 disabled:opacity-50"
                        disabled={submitLoading}
                    >
                        <FaPaperPlane className="h-6 w-6" />
                    </button>
                </div>
            </div>

        </div>
    );
}
