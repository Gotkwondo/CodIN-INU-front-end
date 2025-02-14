// 예: /components/BoardLayout.tsx

"use client";

import { FC, PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import Tabs from "@/components/Layout/Tabs";
import { boardData } from "@/data/boardData"; // boardData의 타입(alias) 직접 정의하시면 됩니다.
import Header from "./header/Header";
import DefaultBody from "./Body/defaultBody";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";

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
        <>
            {/* 고정 헤더 */}
            <Header>
                <Header.BackButton/>
                <Header.Title>{name}</Header.Title>
                <Header.SearchButton/>
            </Header>
            {/* Tabs Section */}
            <DefaultBody hasHeader={1}>
                {hasTabs && (
                    <div className="mt-[18px]">
                        <Tabs
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={onTabChange}
                        />
                    </div>
                )}

                {/* children 영역: 게시물 리스트, 로딩, 페이지네이션, 글쓰기 버튼 등 */}
                {children}
            </DefaultBody>
            <BottomNav/>
        </>
    );
};

export default BoardLayout;
