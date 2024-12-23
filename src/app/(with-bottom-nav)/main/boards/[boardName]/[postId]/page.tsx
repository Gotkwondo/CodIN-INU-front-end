import PostDetailClient from "./PostDetailClient";

interface PostDetailPageProps {
    params: {
        boardName: string;
        postId: string;
    };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
    return <PostDetailClient postId={params.postId} />;
}
