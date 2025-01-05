// PostDetailPage.tsx (하위 페이지)
import LayoutWithBottomNav from '../../../../layout';
import PostDetailClient from './PostDetailClient';

export interface PostDetailPageProps {
    params: Promise<{ _id: string }>;
}


export default async function PostDetailPage({ params }: PostDetailPageProps) {
    const resolvedParams = await params; // Promise 해제
    return (
        <PostDetailClient postId={resolvedParams._id} />
    );
}
