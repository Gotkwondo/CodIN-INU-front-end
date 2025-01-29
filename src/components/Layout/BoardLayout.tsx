// 예: /components/BoardLayout.tsx

"use client";

import { FC, PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import Tabs from "@/components/Layout/Tabs";
import { boardData } from "@/data/boardData"; // boardData의 타입(alias) 직접 정의하시면 됩니다.

interface BoardLayoutProps extends PropsWithChildren {
    board: any;
    activeTab: string;
    onTabChange: (tabValue: string) => void;
}

const BoardLayout: FC<BoardLayoutProps> = ({
                                               board,
                                               activeTab,
                                               onTabChange,
                                               children,
                                           }) => {
    const router = useRouter();
    const { name, icon, tabs } = board;
    const hasTabs = tabs.length > 0;

    return (
        <div className="bg-white min-h-screen w-full relative">
            {/* 고정 헤더 */}
            <header className="sticky top-0 bg-white z-50 shadow-md">
                <div className="max-w-4xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between h-16">
                        {/* Back Button */}
                        <button
                            onClick={() => router.replace("/main")}
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
                            <span className="mr-2">{icon}</span> {name}
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
                                onTabChange={onTabChange}
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* children 영역: 게시물 리스트, 로딩, 페이지네이션, 글쓰기 버튼 등 */}
            <main className="p-4">{children}</main>
        </div>
    );
};

export default BoardLayout;
