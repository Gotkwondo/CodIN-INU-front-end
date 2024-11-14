// src/components/PostList.tsx

import { FC } from 'react';
import PostItem from './PostItem';
import { Post } from '@/interfaces/Post';

interface PostListProps {
    posts: Post[];
    boardName: string;
}

const PostList: FC<PostListProps> = ({ posts, boardName }) => {
    return (
        <ul className="space-y-4">
            {posts.map((post) => (
                <PostItem key={post.id} post={post} boardName={boardName} />
            ))}
        </ul>
    );
};

export default PostList;
