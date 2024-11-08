// components/PostList.tsx
'use client';

import { FC } from 'react';
import PostItem from './PostItem';

interface Post {
    title: string;
    content: string;
    views: number;
    likes: number;
    comments: number;
    timeAgo: string;
    icon: string;
}

interface PostListProps {
    posts: Post[];
}

const PostList: FC<PostListProps> = ({ posts }) => {
    return (
        <ul className="space-y-4">
            {posts.map((post, index) => (
                <PostItem key={index} post={post} />
            ))}
        </ul>
    );
};

export default PostList;
