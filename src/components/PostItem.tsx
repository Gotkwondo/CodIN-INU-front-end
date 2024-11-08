// components/PostItem.tsx
'use client';

import { FC } from 'react';
import Image from 'next/image';

interface Post {
    title: string;
    content: string;
    views: number;
    likes: number;
    comments: number;
    timeAgo: string;
    icon: string;
}

interface PostItemProps {
    post: Post;
}

const PostItem: FC<PostItemProps> = ({ post }) => {
    return (
        <li className="flex items-start space-x-4 bg-white p-1 border-b">
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">{post.title}</h3>
                <p className="text-xs text-gray-600">{post.content}</p>
                <div className="flex items-center text-xs text-gray-500 mt-4 space-x-4">
                    <span>👁️ {post.views}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                </div>
            </div>
            <div>
                <div className="w-12 h-12">
                    <Image
                        src={post.icon}
                        alt="icon"
                        width={48}
                        height={48}
                        className="rounded bg-gray-500"
                    />
                </div>
                <span className="text-[9px] text-gray-400">{post.timeAgo}</span>
            </div>
        </li>
    );
};

export default PostItem;
