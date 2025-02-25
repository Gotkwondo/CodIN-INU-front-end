"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PostItem from "@/components/board/PostItem";
import PageHeaderModal from "@/components/board/pageHeaderModal";
import PostDetailClient from "@/app/(auth-required)/main/boards/[boardName]/[postId]/PostDetailClient";

const PostList: React.FC<{ posts: any[]; boardName: string; boardType: string }> = ({
                                                                                        posts,
                                                                                        boardName,
                                                                                        boardType,
                                                                                    }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedPost, setSelectedPost] = useState<any | null>(null);

    useEffect(() => {
        const postId = searchParams.get("postId"); // URL에서 postId 가져오기
        if (postId) {
            const post = posts.find((p) => p._id === postId); // postId와 매칭되는 게시물 찾기
            if (post) {
                setSelectedPost(post); // 게시물 설정
            }
        }
    }, [searchParams, posts]);

    const openModal = (post: any) => {
        setSelectedPost(post);

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("postId", post._id);

        // URL 변경 후 shallow 업데이트
        router.push(currentUrl.toString());
    };

    const closeModal = () => {
        setSelectedPost(null);

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("postId");

        // URL 변경 후 shallow 업데이트
        router.push(currentUrl.toString());
    };

    return (
        <div>
            <ul
                className={`${
                    boardType === "gallery" ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 mt-[18px] gap-[24px]"
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
                <PageHeaderModal onClose={closeModal} post={selectedPost}>
                    <PostDetailClient postId={selectedPost._id} />
                </PageHeaderModal>
            )}
        </div>
    );
};

export default PostList;
