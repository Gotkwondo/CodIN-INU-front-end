
"use client";

import { FC, useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Tabs from "@/components/Tabs";
import PostList from "@/components/PostList";
import { boardData } from "@/data/boardData";
import { Post } from "@/interfaces/Post";
import axios from "axios";
import { useRouter } from "next/navigation";

import Image from "next/image";

const BoardPage: FC = () => {
    const params = useParams();
    const boardName = params.boardName as string;

    const router = useRouter(); // useRouter 훅 추가
    const board = boardData[boardName];

    if (!board) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">
                    존재하지 않는 게시판입니다.
                </h2>
            </div>
        );
    }

    const { tabs, type: boardType } = board;
    const hasTabs = tabs.length > 0;
    const defaultTab = hasTabs ? tabs[0].value : "default";

    const [activeTab, setActiveTab] = useState<string>(defaultTab);
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [selectedImages, setSelectedImages] = useState<string[]>([]); // 선택된 이미지 상태

    const isFetching = useRef(false);

    const fetchPosts = async (pageNumber: number) => {
        if (isFetching.current) return;

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("토큰이 없습니다. 로그인이 필요합니다. 로그인페이지로");
            }


            const activePostCategory =
                tabs.find((tab) => tab.value === activeTab)?.postCategory || "";

            console.log("API 호출: 카테고리", activePostCategory, "페이지:", pageNumber);

            setIsLoading(true);
            isFetching.current = true;

            const response = await axios.get(
                `https://www.codin.co.kr/api/posts/category`,
                {
                    headers: {
                        Authorization: token,
                    },
                    params: {
                        postCategory: activePostCategory,
                        page: pageNumber,
                    },
                }
            );

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
        } catch (error) {
            console.error("API 호출 오류:", error);
            if(error.status === 401){
                window.location.href = "/login"; // 로그인 페이지로 리다이렉트
            }
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files).map((file) =>
                URL.createObjectURL(file)
            );
            setSelectedImages((prevImages) => [...prevImages, ...newImages]);
        }
        event.target.value = ""; // 파일 선택 초기화
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        );
    };

    useEffect(() => {
        // 컴포넌트가 처음 로드되었을 때 상태 초기화
        const initializeBoard = async () => {
            setIsLoading(true);
            try {
                setPosts([]); // 초기화
                setPage(0);
                setHasMore(true);
                await fetchPosts(0); // 첫 번째 데이터 로드
            } catch (error) {
                console.error("초기화 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeBoard(); // 초기화 함수 호출
    }, [boardName, activeTab]);

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
        if (page >= 0) {
            console.log("페이지 변경: 새 데이터 요청", "페이지:", page);
            fetchPosts(page);
        }
    }, [page]);

    return (
        <div className="bg-white min-h-screen relative">
            {/* 고정 헤더 */}
            <header className="sticky top-0 bg-white z-50 shadow-md">
                <div className="max-w-4xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between h-16">
                        {/* Back Button */}
                        <button
                            onClick={() => router.replace('/main')}
                            className="text-gray-700 hover:text-gray-900 transition duration-300"
                            aria-label="뒤로가기"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-gray-700 flex items-center justify-center">
                            <span className="mr-2">{board.icon}</span> {board.name}
                        </h1>

                        {/* Right Spacer */}
                        <div className="w-6"></div>
                    </div>

                    {/* Tabs Section */}
                    {hasTabs && (
                        <div className="mt-2">
                            <Tabs
                                tabs={tabs}
                                activeTab={activeTab}
                                onTabChange={(tab) => {
                                    console.log("탭 변경:", tab);
                                    setActiveTab(tab);
                                }}
                            />
                        </div>
                    )}
                </div>
            </header>



            {/* 게시물 리스트 */}
            <main className="p-4">
                <PostList posts={posts} boardName={boardName} boardType={boardType} />

                {/* 로딩 표시 */}
                {isLoading && (
                    <div className="text-center my-4 text-gray-500">로딩 중...</div>
                )}

                {/* 데이터가 없을 때 메시지 */}
                {!hasMore && !isLoading && posts.length === 0 && (
                    <div className="text-center my-4 text-gray-500">게시물이 없습니다.</div>
                )}
            </main>

            {/* 글쓰기 버튼 */}
            <Link
                href={`/main/boards/${boardName}/create`}
                className="fixed bottom-16 right-8 bg-blue-500 text-white rounded-full shadow-lg p-4 hover:bg-blue-600 transition duration-300"
                aria-label="글쓰기"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182l-9.193 9.193a4.5 4.5 0 0 1-1.591 1.033l-3.588 1.196 1.196-3.588a4.5 4.5 0 0 1-1.033-1.591l9.193-9.193z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 19.5h-6m-7.5 0a4.5 4.5 0 0 0 4.5-4.5v-3"
                    />
                </svg>
            </Link>
        </div>
    );
};

export default BoardPage;
