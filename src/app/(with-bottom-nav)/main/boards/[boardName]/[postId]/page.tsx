// PostDetailPage.tsx (하위 페이지)
import LayoutWithBottomNav from '../../../../layout';
import PostDetailClient from './PostDetailClient';

interface PostDetailPageProps {
    params: { postId: string };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
    return (
            <PostDetailClient postId={params.postId} />
    );
}
