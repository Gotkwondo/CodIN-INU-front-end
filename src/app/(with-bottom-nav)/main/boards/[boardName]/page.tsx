// src/app/(with-bottom-nav)/main/boards/[boardName]/page.tsx
"use client"
import { FC, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Tabs from '@/components/Tabs';
import PostList from '@/components/PostList';
import { boardData } from '@/data/boardData';
import { localPosts } from '@/data/localPosts';
import { Post } from '@/interfaces/Post';

const BoardPage: FC = () => {
    const params = useParams();
    const boardName = params.boardName as string;

    // 게시판 정보 가져오기
    const board = boardData[boardName];

    if (!board) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">존재하지 않는 게시판입니다.</h2>
            </div>
        );
    }

    // 탭 정보 설정
    const tabs = board.tabs;
    const hasTabs = tabs.length > 0;
    const defaultTab = hasTabs ? tabs[0].value : 'default';

    const [activeTab, setActiveTab] = useState<string>(defaultTab);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        // 로컬 데이터에서 게시물 가져오기
        const boardPosts = localPosts[boardName];

        if (boardPosts) {
            const tabPosts = hasTabs ? boardPosts[activeTab] : boardPosts['default'];
            setPosts(tabPosts || []);
        } else {
            setPosts([]);
        }
    }, [boardName, activeTab]);

    return (
        <div className="bg-white min-h-screen p-4 pb-16">
            {/* 페이지 헤더 */}
            <header className="text-center my-4">
                <h1 className="text-2xl font-bold text-gray-700 flex items-center justify-center">
                    <span className="mr-2">{board.icon}</span> {board.name}
                </h1>
                {/* Tabs 컴포넌트 사용 */}
                {hasTabs && <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />}
            </header>

            {/* PostList 컴포넌트 사용 */}
            <PostList posts={posts} boardName={boardName} />
        </div>
    );
};

export default BoardPage;
