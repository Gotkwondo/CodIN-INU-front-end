// src/components/PostItem.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/interfaces/Post';
import {useEffect} from "react";

interface PostItemProps {
    post: Post;
    boardName: string;
}

const PostItem: React.FC<PostItemProps> = ({ post, boardName }) => {
    console.log("post")
    console.log(post)
    console.log("boardName")
    console.log(boardName)
    return (
        <li className="flex items-start space-x-4 bg-white p-1 border-b">
            <Link href={`./${boardName}/${post.id}`} className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">{post.title}</h3>
                <p className="text-xs text-gray-600">{post.content}</p>
                <div className="flex items-center text-xs text-gray-500 mt-4 space-x-4">
                    <span>👁️ {post.views}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                </div>
            </Link>
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
