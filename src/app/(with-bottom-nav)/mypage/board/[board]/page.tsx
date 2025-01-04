"use client";

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

const MyBoardPage: FC = () => {
    const params = useParams();
    const board = params.board as string; // "posts", "likes", "comments", "scraps" 중 하나

    // 매핑된 엔드포인트 가져오기
    const selectedEndpoint = endpointMap[board];
    if (!selectedEndpoint) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">
                    존재하지 않는 마이페이지 보드입니다.
                </h2>
            </div>
        );
    }

    // 탭이 필요 없다면 빈 배열로 처리하거나, 혹은 "내 게시글", "좋아요" 등 탭처럼 보여줄 수도 있음
    // 여기서는 예시로 tabs를 생략하거나, 필요하다면 아래처럼 간단히 구현 가능
    // const tabs = [{ label: "전체", value: "all" }, ... ];
    const tabs: { label: string; value: string }[] = [];

    // BoardLayout에 넘겨줄 props(예: board 이름, 아이콘, 탭 등)
    // 필요에 따라 원하는 식으로 정의하세요.
    const fakeBoardData = {
        name: board.toUpperCase(), // 예: "POSTS", "LIKES", ...
        icon: "⭐️", // 임의 아이콘
        tabs,
        type: "myboard", // 본인 프로젝트 구조에 맞춰 입력
    };

    // 게시글 데이터
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isFetching = useRef(false);

    // 게시물 요청 함수
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

                // 새롭게 가져온 게시글들을 기존 게시글 리스트에 합치기
                setPosts((prevPosts) => [...prevPosts, ...contents]);
                // nextPage가 -1이면 더 이상 페이지가 없음
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
                window.location.href = "/login"; // 로그인 페이지로 리다이렉트
            }
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    };

    // 초기 로드 시
    useEffect(() => {
        const initializeBoard = async () => {
            setPosts([]);
            setPage(0);
            setHasMore(true);
            await fetchPosts(0);
        };
        initializeBoard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [board]);

    // 스크롤 이벤트로 무한 스크롤
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

    // page 변경 시 추가 데이터 요청
    useEffect(() => {
        if (page > 0) {
            console.log("페이지 변경: 새 데이터 요청, 페이지:", page);
            fetchPosts(page);
        }
    }, [page]);

    return (
        <BoardLayout
            board={fakeBoardData} // 임의로 구성한 보드 데이터
            activeTab="" // 탭 필요 없으면 빈 문자열
            onTabChange={() => {}} // 탭 기능이 필요 없으면 비워두어도 됨
        >
            {/* 게시글 리스트 */}
            <PostList posts={posts} boardName={board} boardType="myboard" />

            {/* 로딩 표시 */}
            {isLoading && (
                <div className="text-center my-4 text-gray-500">로딩 중...</div>
            )}

            {/* 데이터가 없을 때 메시지 */}
            {!hasMore && !isLoading && posts.length === 0 && (
                <div className="text-center my-4 text-gray-500">게시물이 없습니다.</div>
            )}

            {/* 더 이상 데이터가 없을 때 메시지 */}
            {!hasMore && !isLoading && posts.length > 0 && (
                <div className="text-center my-4 text-gray-500">마지막 게시물입니다.</div>
            )}
        </BoardLayout>
    );
};

export default MyBoardPage;
