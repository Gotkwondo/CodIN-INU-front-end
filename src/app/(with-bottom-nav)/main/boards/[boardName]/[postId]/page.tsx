    import { Post } from "@/interfaces/Post";
    import { localPosts } from "@/data/localPosts";
    import PostDetailClient from "./PostDetailClient";

    interface PostDetailPageProps {
        params: {
            boardName: string;
            postId: string;
        };
    }

    export default async function PostDetailPage({ params }: PostDetailPageProps) {
        // `params`는 비동기적으로 제공되므로 대기 후 사용
        const resolvedParams = await Promise.resolve(params);
        const { boardName, postId } = resolvedParams;

        // 게시물 ID를 숫자로 변환
        const postIdNumber = parseInt(postId, 10);
        const boardPosts = localPosts[boardName];
        let post: Post | undefined;

        if (boardPosts) {
            const allPosts = Object.values(boardPosts).flat();
            post = allPosts.find((p) => p.id === postIdNumber);
        }

        if (!post) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <h2 className="text-xl font-semibold text-gray-700">
                        게시물을 찾을 수 없습니다.
                    </h2>
                </div>
            );
        }

        // 클라이언트 컴포넌트에 데이터 전달
        return <PostDetailClient post={post} />;
    }
