import { FC } from "react";
import PostItem from "./PostItem";
import { Post } from "@/interfaces/Post";

interface PostListProps {
    posts: Post[];
    boardName: string;
    boardType: string; // 추가: 게시판 타입
}

const PostList: FC<PostListProps> = ({ posts, boardName, boardType }) => {
    return (
        <div
            className={
                boardType === "gallery"
                    ? "grid grid-cols-2 gap-4"
                    : boardType === "imageAndLabel"
                        ? "grid grid-cols-2 gap-4" // `imageAndLabel`에 대한 추가 스타일
                        : "space-y-4"
            }
        >
            {posts.map((post) => (
                <PostItem
                    key={post.id}
                    post={post}
                    boardName={boardName}
                    boardType={boardType} // 게시판 타입 전달
                />
            ))}
        </div>
    );
};

export default PostList;
