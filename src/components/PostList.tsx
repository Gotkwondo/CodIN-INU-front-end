import { FC } from "react";
import PostItem from "./PostItem";
import { Post } from "@/interfaces/Post";

interface PostListProps {
    posts: Post[];
    boardName: string;
    boardType: string;
}

const PostList: FC<PostListProps> = ({ posts, boardName, boardType }) => {
    console.log("렌더링 중 posts 데이터:", posts); // 디버깅용

    return (
        <div
            className={
                boardType === "gallery"
                    ? "grid grid-cols-2 gap-4"
                    : boardType === "imageAndLabel"
                        ? "grid grid-cols-2 gap-4"
                        : "space-y-4"
            }
        >
            {posts.map((post, index) => (
                <PostItem
                    key={post._id || index} // postId가 없으면 index 사용
                    post={post}
                    boardName={boardName}
                    boardType={boardType}
                />
            ))}
        </div>
    );
};

export default PostList;
