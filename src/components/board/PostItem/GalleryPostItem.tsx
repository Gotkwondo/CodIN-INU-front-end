import Image from "next/image";
import { Post } from "@/interfaces/Post";
import { getDefaultImageUrl } from "./utils";
import PostStats from "./PostStats";

interface Props {
    post: Post;
    onOpenModal: (post: Post) => void;
}

const GalleryPostItem: React.FC<Props> = ({ post, onOpenModal }) => {
    const imageUrl = post.postImageUrl?.[0] || getDefaultImageUrl(post.title);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onOpenModal(post);
    };

    return (
        <li className="flex flex-col bg-white overflow-hidden rounded shadow">
            <a href="#" onClick={handleClick}>
                <div className="relative w-full h-[100px]">
                    <Image
                        src={imageUrl}
                        alt={post.title}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="p-2">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                        {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {post.content}
                    </p>
                    <PostStats post={post} />
                </div>
            </a>
        </li>
    );
};

export default GalleryPostItem;
