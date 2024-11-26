"use client";

import { useState } from "react";
import ReportModal from "@/components/ReportModal";
import { Post } from "@/interfaces/Post";

interface PostDetailClientProps {
    post: Post;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
    const [isReportModalOpen, setReportModalOpen] = useState(false);

    const handleOpenReportModal = () => setReportModalOpen(true);
    const handleCloseReportModal = () => setReportModalOpen(false);

    return (
        <div className="bg-white min-h-screen p-4 pb-16">
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                    <span>👁️ {post.views}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>{post.timeAgo}</span>
                </div>
            </header>
            <article className="prose mb-8">
                <p>{post.content}</p>
            </article>
            <div className="flex justify-end">
                <button
                    onClick={handleOpenReportModal}
                    className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                    신고하기
                </button>
            </div>
            {isReportModalOpen && (
                <ReportModal onClose={handleCloseReportModal} postId={post.id.toString()} />
            )}
        </div>
    );
}
