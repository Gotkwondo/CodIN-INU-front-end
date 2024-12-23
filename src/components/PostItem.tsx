import Link from "next/link";
import Image from "next/image";
import { Post } from "@/interfaces/Post";

interface PostItemProps {
    post: Post;
    boardName: string;
    boardType: string; // 추가: 게시판 타입
}

const PostItem: React.FC<PostItemProps> = ({ post, boardName, boardType }) => {
    const defaultImage = "/images/placeholder.png";
    const imageUrl = post.postImageUrl.length > 0 ? post.postImageUrl[0] : defaultImage;

    return boardType === "gallery" ? (
        // 갤러리형 디자인
        <li className="flex flex-col w-full bg-white overflow-hidden">
            <Link href={`${boardName}/${post.postId}`}>
                <div className="relative w-full h-32">
                    <Image
                        src={imageUrl}
                        alt={post.title}
                        width={400}
                        height={400}
                        className="object-contain w-full h-full bg-amber-50"
                    />
                </div>
                <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {post.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{post.content}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-2 space-x-4">
                        <span>❤️ {post.likeCount}</span>
                        <span>💬 {post.commentCount}</span>
                        <span>⭐ {post.scrapCount}</span>
                    </div>
                </div>
            </Link>
        </li>
    ) : boardType === "imageAndLabel" ? (
        // `imageAndLabel` 디자인
        <li className="flex flex-col w-full bg-white overflow-hidden p-4 border rounded-lg shadow">
            <Link href={`${boardName}/${post.postId}`} className="block">
                <div className="aspect-square flex items-center justify-center bg-gray-50 rounded mb-2">
                    <Image
                        src={imageUrl}
                        alt={post.title}
                        width={80}
                        height={80}
                        className="object-contain w-20 h-20"
                    />
                </div>
                <p className="text-center font-medium text-gray-800">{post.title}</p>
            </Link>
        </li>
    ) : (
        // 리스트형 디자인
        <li className="flex items-start space-x-4 bg-white p-1 border-b">
            <Link href={`${boardName}/${post.postId}`} className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">{post.title}</h3>
                <p className="text-xs text-gray-600">{post.content}</p>
                <div className="flex items-center text-xs text-gray-500 mt-4 space-x-4">
                    <span>❤️ {post.likeCount}</span>
                    <span>💬 {post.commentCount}</span>
                    <span>⭐ {post.scrapCount}</span>
                </div>
            </Link>
        </li>
    );
};

export default PostItem;
