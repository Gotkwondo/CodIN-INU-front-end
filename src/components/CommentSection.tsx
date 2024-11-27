import React, { useState } from "react";
import { commentsData } from "@/data/commentsData";

interface CommentSectionProps {
    boardName: string;
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ boardName, postId }) => {
    const [newComment, setNewComment] = useState("");

    // commentsData에서 boardName과 postId에 해당하는 댓글 가져오기
    const comments = commentsData[boardName]?.[postId] || [];

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        // 새 댓글 추가 로직 (예: 서버 요청)
        console.log("새 댓글:", newComment);
        setNewComment("");
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">댓글</h2>
            <ul className="space-y-4">
                {comments.map((comment) => (
                    <li key={comment.id} className="p-4 bg-gray-100 rounded-lg shadow">
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-gray-500">{comment.createdAt}</p>
                        <p className="text-sm">좋아요 {comment.likes}</p>
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요."
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleAddComment}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    댓글 추가
                </button>
            </div>
        </div>
    );
};

export default CommentSection;
