"use client";

import { FC, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Tabs from "@/components/Tabs";
import PostList from "@/components/PostList";
import { boardData } from "@/data/boardData";
import { Post } from "@/interfaces/Post";
import axios from "axios";

const BoardPage: FC = () => {
    const params = useParams();
    const boardName = params.boardName as string;

    // 게시판 정보 가져오기
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

    useEffect(() => {
        // API 호출하여 게시물 가져오기
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("accessToken"); // 토큰 가져오기
                if (!token) {
                    console.error("토큰이 없습니다. 로그인이 필요합니다.");
                    return;
                }

                // 현재 활성 탭에 해당하는 postCategory 가져오기
                const activePostCategory =
                    tabs.find((tab) => tab.value === activeTab)?.postCategory || "";

                console.log("Active Tab Post Category:", activePostCategory);

                const response = await axios.get(
                    `https://www.codin.co.kr/api/posts/category`,
                    {
                        headers: {
                            Authorization: token, // Authorization 헤더 추가
                        },
                        params: {
                            postCategory: activePostCategory, // postCategory 설정
                        },
                    }
                );

                console.log("API Response:", response.data);

                if (response.data.success) {
                    setPosts(response.data.dataList);
                } else {
                    console.error("게시물 로드 실패:", response.data.message);
                }
            } catch (error) {
                console.error("API 호출 오류:", error);
            }
        };

        fetchPosts();
    }, [boardName, activeTab]);

    return (
        <div className="bg-white min-h-screen p-4 pb-16 relative">
            {/* 페이지 헤더 */}
            <header className="text-center my-4">
                <h1 className="text-2xl font-bold text-gray-700 flex items-center justify-center">
                    <span className="mr-2">{board.icon}</span> {board.name}
                </h1>
                {hasTabs && (
                    <Tabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(tab) => {
                            console.log("Tab changed to:", tab);
                            setActiveTab(tab);
                        }}
                    />
                )}
            </header>

            {/* PostList 컴포넌트에 게시판 타입 전달 */}
            <PostList posts={posts} boardName={boardName} boardType={boardType} />

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
