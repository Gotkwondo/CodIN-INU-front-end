import { ReactNode } from 'react';
import BottomNav from '../../components/BottomNav';
import Header from '../../components/Header';

interface LayoutWithBottomNavProps {
    children: ReactNode;
    headerTitle?: string;
    headerMode?: 'search' | 'menu';
    isStackState?: boolean; // 스택 상태를 나타내는 props
}

export default function LayoutWithBottomNav({
                                                children,
                                                headerTitle = 'Default Title',
                                                headerMode = 'menu',
                                                isStackState = false, // 기본값은 false (스택 상태 아님)
                                            }: LayoutWithBottomNavProps) {
    console.log("isStackState:", isStackState); // 디버깅용 로그

    return (
        <>
            {/* 스택 상태일 때만 헤더를 표시 */}
            {/*{isStackState && <Header title={headerTitle} mode={headerMode} />}*/}
            {children}
            {/* 스택 상태가 아니면 바텀 네비게이션 표시 */}
            {/*{!isStackState && <BottomNav />}*/}
        </>
    );
}
