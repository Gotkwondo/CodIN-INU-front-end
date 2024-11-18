// src/app/boards/[boardName]/[postId]/page.tsx

import { Post } from '@/interfaces/Post';
import { localPosts } from '@/data/localPosts';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';

interface PostDetailPageProps {
    params: {
        boardName: string;
        postId: string;
    };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
    const { boardName, postId } = params;

    // 게시물 ID를 숫자로 변환
    const postIdNumber = parseInt(postId, 10);

    // 로컬 데이터에서 게시물 찾기
    const boardPosts = localPosts[boardName];
    let post: Post | undefined;

    if (boardPosts) {
        // 모든 탭의 게시물을 합쳐서 검색
        const allPosts = Object.values(boardPosts).flat();
        post = allPosts.find((p) => p.id === postIdNumber);
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">게시물을 찾을 수 없습니다.</h2>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen p-4 pb-16">
            <header className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
                <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                    <span>👁️ {post.views}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>{post.timeAgo}</span>
                </div>
            </header>
            <article className="prose">
                <p>{post.content}</p>
                {/* 추가적인 게시물 내용 표시 */}
            </article>

            {/* 댓글 작성 섹션 */}
            <section className="mt-8">
                <h2 className="text-xl font-semibold">댓글 작성</h2>
                <CommentForm postId={postId} />
            </section>

            {/* 댓글 목록 섹션 */}
            <section className="mt-8">
                <h2 className="text-xl font-semibold">댓글</h2>
                <CommentList postId={postId} />
            </section>
        </div>
    );
}
