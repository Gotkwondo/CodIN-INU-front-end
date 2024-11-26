"use client";

import { useState } from "react";
import { commentsData } from "@/data/comments";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
    boardName: string;
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ boardName, postId }) => {
    const [newComment, setNewComment] = useState("");
    const comments = commentsData[boardName]?.[postId] || [];

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        alert(`새 댓글 추가: ${newComment}`);
        setNewComment(""); // 입력 필드 초기화
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">댓글</h3>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
            <div className="flex items-center mt-6">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow border rounded p-2 mr-2 text-sm"
                    placeholder="댓글을 입력하세요..."
                />
                <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                    작성
                </button>
            </div>
        </div>
    );
};

export default CommentSection;
