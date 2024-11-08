// app/(with-bottom-nav)/main/boards/need-help/page.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import Tabs from '@/components/Tabs';
import PostList from '@/components/PostList';

interface Post {
    title: string;
    content: string;
    views: number;
    likes: number;
    comments: number;
    timeAgo: string;
    icon: string;
}

// 로컬 데이터 설정 (기존 데이터 그대로 사용)

// 로컬 데이터 설정
const localData = {
    study: [
        {
            title: "스터디 SNS 프로젝트 시작",
            content: "스터디 내용을 입력하세요.",
            views: 1956,
            likes: 653,
            comments: 865,
            timeAgo: "14시간 전",
            icon: "/icons/sample1.png",
        },{
            title: "스터디 SNS 프로젝트 시작",
            content: "스터디 내용을 입력하세요.",
            views: 1956,
            likes: 653,
            comments: 865,
            timeAgo: "14시간 전",
            icon: "/icons/sample1.png",
        },
        {
            title: "스터디 SNS 프로젝트 시작",
            content: "스터디 내용을 입력하세요.",
            views: 1956,
            likes: 653,
            comments: 865,
            timeAgo: "14시간 전",
            icon: "/icons/sample1.png",
        },
    ],
    project: [
        {
            title: "프로젝트 SNS 시작",
            content: "프로젝트 내용을 입력하세요.",
            views: 1234,
            likes: 456,
            comments: 789,
            timeAgo: "10시간 전",
            icon: "/icons/sample2.png",
        },
        {
            title: "프로젝트 SNS 시작",
            content: "프로젝트 내용을 입력하세요.",
            views: 1234,
            likes: 456,
            comments: 789,
            timeAgo: "10시간 전",
            icon: "/icons/sample2.png",
        },
    ],
    competition: [
        {
            title: "대회 SNS 시작",
            content: "대회 내용을 입력하세요.",
            views: 1111,
            likes: 222,
            comments: 333,
            timeAgo: "8시간 전",
            icon: "/icons/sample3.png",
        },{
            title: "대회 SNS 시작",
            content: "대회 내용을 입력하세요.",
            views: 1111,
            likes: 222,
            comments: 333,
            timeAgo: "8시간 전",
            icon: "/icons/sample3.png",
        },{
            title: "대회 SNS 시작",
            content: "대회 내용을 입력하세요.",
            views: 1111,
            likes: 222,
            comments: 333,
            timeAgo: "8시간 전",
            icon: "/icons/sample3.png",
        },{
            title: "대회 SNS 시작",
            content: "대회 내용을 입력하세요.",
            views: 1111,
            likes: 222,
            comments: 333,
            timeAgo: "8시간 전",
            icon: "/icons/sample3.png",
        },
    ],
    etc: [
        {
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },
        {
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },{
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },
        {
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },{
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },
        {
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },{
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },
        {
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },{
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },
        {
            title: "기타 SNS 시작",
            content: "기타 내용을 입력하세요.",
            views: 4444,
            likes: 555,
            comments: 666,
            timeAgo: "5시간 전",
            icon: "/icons/sample4.png",
        },
    ],
};

const NeedHelpPage: FC = () => {
    type TabType = 'study' | 'project' | 'competition' | 'etc';
    const [activeTab, setActiveTab] = useState<TabType>('study');
    const [posts, setPosts] = useState<Post[]>(localData['study']);

    useEffect(() => {
        // API 호출 대신 로컬 데이터를 사용하여 탭에 맞는 데이터를 설정
        // 나중에 API 다 만들어지면 연결
        // const fetchPost = async () => {
        //     setLoading(true);
        //     try {
        //         const response = await fetch(/api/post?tab=${activeTab}); API 주소
        //         const data = await response.json();
        //         setPost(data);
        //     } catch (error) {
        //         console.error("Failed to fetch post:", error);
        //         setPost(null);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        // fetchPost();

        setPosts(localData[activeTab]);
    }, [activeTab]);

    // 탭 정보 설정
    const tabs = [
        { label: '스터디', value: 'study' },
        { label: '프로젝트', value: 'project' },
        { label: '대회', value: 'competition' },
        { label: '기타', value: 'etc' },
    ];

    return (
        <div className="bg-white min-h-screen p-4 pb-16">
            {/* 페이지 헤더 */}
            <header className="text-center my-4">
                <h1 className="text-2xl font-bold text-gray-700 flex items-center justify-center">
                    <span className="mr-2">🖐️</span> 구해요
                </h1>
                {/* Tabs 컴포넌트 사용 */}
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </header>

            {/* PostList 컴포넌트 사용 */}
            <PostList posts={posts} />
        </div>
    );
};

export default NeedHelpPage;
