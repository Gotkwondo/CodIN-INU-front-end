"use client";

import Image from "next/image";
import { Post } from "@/interfaces/Post";
import { boardData } from "@/data/boardData";

interface PostItemProps {
    post: Post;
    boardName: string;
    boardType: string; // 추가: 게시판 타입
    onOpenModal: (post: Post) => void; // 모달 열기 핸들러
}

const PostItem: React.FC<PostItemProps> = ({ post, boardName, boardType, onOpenModal }) => {
    const imageUrl = post.postImageUrl?.length > 0 ? post.postImageUrl[0] : null;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // 기본 Link 동작 방지
        onOpenModal(post); // 모달 열기
    };

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

    const postStats = (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sr text-sub gap-2 sm:gap-0">
            {/* 아이콘과 통계 데이터 */}
            <div className="flex space-x-[6px]">
      <span className="flex items-center gap-[4.33px]">
        <img src="/icons/board/viewIcon.svg" width={16} height={16} />
          {post.hits || 0}
      </span>
                <span className="flex items-center gap-[4.33px]">
        <img src="/icons/board/heartIcon.svg" width={16} height={16} />
                    {post.likeCount || 0}
      </span>
                <span className="flex items-center gap-[4.33px]">
        <img src="/icons/board/commentIcon.svg" width={16} height={16} />
                    {post.commentCount || 0}
      </span>
            </div>

            {/* 작성자 정보 및 시간 */}
            <div className="flex items-center text-sub space-x-1">
                <span>{post.anonymous ? "익명" : post.nickname}</span>
                <span> · </span>
                <span>{timeAgo(post.createdAt)}</span>
            </div>
        </div>
    );

    if (boardType === "gallery") {
        // 갤러리형 디자인
        return (
            <li className="flex flex-col bg-white overflow-hidden rounded shadow">
                <a href="#" onClick={handleClick}>
                    <div className="relative w-full h-40">
                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt={post.title}
                                width={400}
                                height={400}
                                className="object-cover w-full h-full bg-amber-50"
                            />
                        )}
                    </div>
                    <div className="p-2">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                            {post.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{post.content}</p>
                        {postStats}
                    </div>
                </a>
            </li>
        );
    } else if (boardType === "imageAndLabel") {
        // 이미지와 레이블형 디자인
        return (
            <li className="flex flex-col w-full bg-white overflow-hidden p-4 border rounded-lg shadow">
                <a href="#" onClick={handleClick} className="block">
                    {imageUrl && (
                        <div className="aspect-square flex items-center justify-center bg-gray-50 rounded mb-2 overflow-hidden">
                            <Image
                                src={imageUrl}
                                alt={post.title}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}
                    <p className="text-center text-sm sm:text-base font-medium text-gray-800">{post.title}</p>
                </a>
            </li>
        );
    } else {
        // 리스트형 디자인
        const mapPostCategoryToBoardPath = (postCategory: string): string | null => {
            for (const boardKey in boardData) {
                const board = boardData[boardKey];
                const tab = board.tabs.find((tab) => tab.postCategory === postCategory);
                if (tab) return boardKey; // 해당 게시판 경로 반환
            }
            return null; // 매칭되는 게시판이 없을 경우
        };

        const boardPath = mapPostCategoryToBoardPath(post.postCategory);

        return (
            <li className="flex items-start justify-between">
                <a href="#" onClick={handleClick} className="flex-1">
                    <h3 className="text-sm sm:text-Lm font-medium text-gray-800 mt-[8px]">{post.title}</h3>
                    <p className="text-xs sm:text-Mm text-sub line-clamp-2 mt-[4px] mb-[8px]">{post.content}</p>
                    {postStats}
                </a>
                {imageUrl && (
                    <div className="ml-4 w-16 h-16 overflow-hidden rounded bg-gray-50 flex-shrink-0">
                        <Image
                            src={imageUrl}
                            alt={post.title}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}
            </li>
        );
    }
};

export default PostItem;