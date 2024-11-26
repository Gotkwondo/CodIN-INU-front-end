import { useState } from "react";

interface Comment {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
    replies: Comment[];
}

interface CommentItemProps {
    comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    const [showReplies, setShowReplies] = useState(false);
    const [newReply, setNewReply] = useState("");

    const handleAddReply = () => {
        if (!newReply.trim()) return;
        alert(`새 대댓글 추가: ${newReply}`);
        setNewReply(""); // 입력 필드 초기화
    };

    return (
        <div className="space-y-2">
            <div className="flex items-start space-x-3">
                <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {comment.author[0]}
                </div>
                <div>
                    <div className="text-sm">
                        <span className="font-semibold">{comment.author}</span>{" "}
                        <span className="text-gray-500">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    <div className="flex items-center space-x-2 text-xs mt-2">
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="text-blue-500 hover:underline"
                        >
                            답글 {showReplies ? "숨기기" : "보기"}
                        </button>
                        <span>❤️ {comment.likes}</span>
                    </div>
                </div>
            </div>
            {showReplies && (
                <div className="ml-8 space-y-3">
                    {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start space-x-3">
                            <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                {reply.author[0]}
                            </div>
                            <div>
                                <div className="text-sm">
                                    <span className="font-semibold">{reply.author}</span>{" "}
                                    <span className="text-gray-500">{reply.createdAt}</span>
                                </div>
                                <p className="text-sm text-gray-700">{reply.content}</p>
                                <span className="text-xs text-gray-500">❤️ {reply.likes}</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex items-center mt-2">
                        <input
                            type="text"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            className="flex-grow border rounded p-2 mr-2 text-sm"
                            placeholder="답글을 입력하세요..."
                        />
                        <button
                            onClick={handleAddReply}
                            className="px-4 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                            작성
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentItem;
