'use client';

import { FC, useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import BoardLayout from "@/components/BoardLayout"; // 기존에 만든 공용 컴포넌트
import PostList from "@/components/PostList";
import { Post } from "@/interfaces/Post";

// board 파라미터와 실제 엔드포인트 매핑
const endpointMap: Record<string, string> = {
    posts: "/users/post",
    likes: "/users/like",
    comments: "/users/comment",
    scraps: "/users/scrap",
};

// 헤더 제목 매핑
const headerTitleMap: Record<string, string> = {
    posts: "내가 작성한 글",
    likes: "좋아요 한 글",
    comments: "댓글을 작성한 글",
    scraps: "스크랩 한 글",
};

const MyBoardPage: FC = () => {
    const params = useParams();
    const board = params.board as string; // "posts", "likes", "comments", "scraps" 중 하나

    // 매핑된 엔드포인트 가져오기
    const selectedEndpoint = endpointMap[board];
    const headerTitle = headerTitleMap[board] || "마이페이지";

    if (!selectedEndpoint) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">
                    존재하지 않는 마이페이지 보드입니다.
                </h2>
            </div>
        );
    }

    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isFetching = useRef(false);

    const fetchPosts = async (pageNumber: number) => {
        if (isFetching.current) return;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("토큰이 없습니다. 로그인이 필요합니다.");
                return;
            }

            setIsLoading(true);
            isFetching.current = true;

            console.log("[MyBoardPage] API 호출:", selectedEndpoint, "page:", pageNumber);

            const response = await axios.get(`https://www.codin.co.kr/api${selectedEndpoint}`, {
                headers: {
                    Authorization: token,
                },
                params: {
                    page: pageNumber,
                },
            });

            if (response.data.success) {
                const contents = Array.isArray(response.data.data.contents)
                    ? response.data.data.contents
                    : [];
                console.log("가져온 데이터:", contents);

                setPosts((prevPosts) => [...prevPosts, ...contents]);
                if (response.data.data.nextPage === -1) {
                    setHasMore(false);
                    console.log("더 이상 데이터가 없습니다.");
                }
            } else {
                console.error("데이터 로드 실패:", response.data.message);
            }
        } catch (error: any) {
            console.error("API 호출 오류:", error);
            if (error.status === 401) {
                window.location.href = "/login";
            }
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    };

    useEffect(() => {
        const initializeBoard = async () => {
            setPosts([]);
            setPage(0);
            setHasMore(true);
            await fetchPosts(0);
        };
        initializeBoard();
    }, [board]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 300 &&
                !isLoading &&
                hasMore &&
                !isFetching.current
            ) {
                console.log("스크롤 이벤트: 다음 페이지 로드");
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoading, hasMore]);

    useEffect(() => {
        if (page > 0) {
            console.log("페이지 변경: 새 데이터 요청, 페이지:", page);
            fetchPosts(page);
        }
    }, [page]);

    return (
        <>


            <BoardLayout
                board={{
                    name: headerTitle,
                    icon: "📋",
                    tabs: [],
                    type: "myboard",
                }}
                activeTab=""
                onTabChange={() => {}}
            >
                <PostList posts={posts} boardName={board} boardType="myboard" />

                {isLoading && (
                    <div className="text-center my-4 text-gray-500">로딩 중...</div>
                )}

                {!hasMore && !isLoading && posts.length === 0 && (
                    <div className="text-center my-4 text-gray-500">게시물이 없습니다.</div>
                )}

                {!hasMore && !isLoading && posts.length > 0 && (
                    <div className="text-center my-4 text-gray-500">마지막 게시물입니다.</div>
                )}
            </BoardLayout>
        </>
    );
};

export default MyBoardPage;
