"use client";

import { FC, useState, useEffect, useRef } from "react";
import axios from "axios";
import PostList from "@/components/board/PostList";
import { Post } from "@/interfaces/Post";
import { FaSearch } from "react-icons/fa";
import BottomNav from "@/components/Layout/BottomNav";
import { Suspense } from 'react'
const SearchPage: FC = () => {
    // 검색어
    const [searchQuery, setSearchQuery] = useState<string>("");
    // 포스트 리스트
    const [posts, setPosts] = useState<Post[]>([]);
    // 현재 페이지 번호
    const [page, setPage] = useState<number>(0);
    // 로딩 상태
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // 더 불러올 데이터가 있는지 여부
    const [hasMore, setHasMore] = useState<boolean>(true);

    // fetch 진행 중인지 체크하기 위한 ref
    const isFetching = useRef(false);

    // 검색 API 요청 함수
    const fetchSearchResults = async (query: string, pageNumber: number) => {
        if (isFetching.current || !query.trim()) return;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("토큰이 없습니다. 로그인이 필요합니다.");
                return;
            }

            setIsLoading(true);
            isFetching.current = true;

            const response = await axios.get(
                "https://www.codin.co.kr/api/posts/search",
                {
                    headers: {
                        Authorization: token,
                    },
                    params: {
                        keyword: query,
                        pageNumber,
                    },
                }
            );

            if (response.data.success) {
                const contents = Array.isArray(response.data.data.contents)
                    ? response.data.data.contents
                    : [];

                // 첫 페이지면 새로 설정, 아니라면 기존 목록에 이어붙이기
                setPosts((prevPosts) =>
                    pageNumber === 0 ? contents : [...prevPosts, ...contents]
                );

                // 다음 페이지가 없으면 hasMore 상태 false 처리
                if (response.data.data.nextPage === -1) {
                    setHasMore(false);
                }
            } else {
                console.error("검색 데이터 로드 실패:", response.data.message);
            }
        } catch (error) {
            console.error("검색 API 호출 오류:", error);
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    };

    // 검색 이벤트 처리 (버튼 클릭 시)
    const handleSearch = () => {
        // 새 검색 시작 시 초기화
        setPosts([]);
        setPage(0);
        setHasMore(true);
        // 첫 페이지 fetch
        fetchSearchResults(searchQuery, 0);
    };

    // 무한 스크롤 처리
    useEffect(() => {
        const handleScroll = () => {
            // 스크롤이 페이지 하단 근처에 도달 & 로딩 중이 아니고 & 더 불러올 게 있고 & 현재 fetch가 진행 중이 아닐 때
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 300 &&
                !isLoading &&
                hasMore &&
                !isFetching.current
            ) {
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoading, hasMore]);

    // page가 증가할 때마다 추가 데이터 로드
    useEffect(() => {
        if (page > 0) {
            fetchSearchResults(searchQuery, page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <Suspense>
        <div className={"w-full h-full"}>
            {/* 상단 헤더 */}
            <header className="flex items-center justify-center h-14 border-b">
                <h1 className="text-lg font-semibold">{`<검색/>`}</h1>
            </header>

            {/* 본문 영역 */}
            <main className="mt-4 px-0">
                {/* 검색창 */}
                <div className="relative mx-4 mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="검색어를 입력하세요"
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition"
                    >
                        <FaSearch />
                    </button>
                </div>

                {/* 검색 결과 목록 */}
                <div className="mx-4">
                    <PostList posts={posts} boardName="search" boardType="search" />
                </div>

                {/* 로딩 상태 표시 */}
                {isLoading && (
                    <div className="text-center my-6 text-gray-500">로딩 중...</div>
                )}

                {/* 검색 결과가 없을 때 표시 */}
                {!hasMore && !isLoading && posts.length === 0 && (
                    <div className="text-center my-6 text-gray-500">
                        검색 결과가 없습니다.
                    </div>
                )}
            </main>

            <BottomNav activeIndex={1} />
        </div>

        </Suspense>
    );
};

export default SearchPage;
