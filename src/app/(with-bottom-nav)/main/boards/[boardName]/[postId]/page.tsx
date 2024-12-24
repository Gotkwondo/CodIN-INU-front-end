import PostDetailClient from "./PostDetailClient";

interface PostDetailPageProps {
    params: Promise<{ boardName: string; postId: string }>;
}

export default async function PostDetailPage({
                                                 params,
                                             }: PostDetailPageProps) {
    // params를 await로 처리
    const resolvedParams = await params;

    return <PostDetailClient postId={resolvedParams.postId} />;
}
