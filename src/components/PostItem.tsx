import Image from "next/image";
import { Post } from "@/interfaces/Post";

interface PostItemProps {
    post: Post;
    boardName: string;
    boardType: string; // 추가: 게시판 타입
    onOpenModal: (post: Post) => void; // 모달 열기 핸들러
}

const PostItem: React.FC<PostItemProps> = ({ post, boardName, boardType, onOpenModal }) => {
    const imageUrl = post.postImageUrl.length > 0 ? post.postImageUrl[0] : null;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // 기본 Link 동작 방지
        onOpenModal(post); // 모달 열기
    };

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
                    <p className="text-center font-medium text-gray-800">{post.title}</p>
                </a>
            </li>
        );
    } else {
        // 리스트형 디자인
        return (
            <li className="flex items-start justify-between bg-white p-2 border-b">
                <a href="#" onClick={handleClick} className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800">{post.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{post.content}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-2 space-x-4">
                        <span>❤️ {post.likeCount}</span>
                        <span>💬 {post.commentCount}</span>
                        <span>⭐ {post.scrapCount}</span>
                    </div>
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
