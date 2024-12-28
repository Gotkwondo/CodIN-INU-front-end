"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import PostItem from "@/components/PostItem";
import Modal from "@/components/Modal";
import PostDetailClient from "@/app/(with-bottom-nav)/main/boards/[boardName]/[postId]/PostDetailClient";

const PostList: React.FC<{ posts: any[]; boardName: string; boardType: string }> = ({
                                                                                        posts,
                                                                                        boardName,
                                                                                        boardType,
                                                                                    }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedPost, setSelectedPost] = useState<any | null>(null);

    const openModal = (post: any) => {
        setSelectedPost(post);

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("postId", post._id);

        router.push(currentUrl.toString(), { shallow: true, scroll: false });
    };

    const closeModal = () => {
        setSelectedPost(null);

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("postId");

        router.push(currentUrl.toString(), { shallow: true, scroll: false });
    };

    return (
        <div>
            <ul
                className={`${
                    boardType === "gallery" ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 gap-4"
                }`}
            >
                {posts.map((post) => (
                    <PostItem
                        key={post._id}
                        post={post}
                        boardName={boardName}
                        boardType={boardType}
                        onOpenModal={() => openModal(post)}
                    />
                ))}
            </ul>

            {/* 모달 */}
            {selectedPost && (
                <Modal onClose={closeModal} post={selectedPost}>
                    {/* PostDetailClient 컴포넌트에 상세 데이터 전달 */}
                    <PostDetailClient postId={selectedPost._id} />
                </Modal>
            )}
        </div>
    );
};

export default PostList;
