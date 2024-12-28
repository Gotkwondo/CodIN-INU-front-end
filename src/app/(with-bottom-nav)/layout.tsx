import { ReactNode } from 'react';
import BottomNav from '../../components/BottomNav';
import Header from '../../components/Header';


export default function LayoutWithBottomNav({
                                                children,
                                            }) {

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
// 리팩토링용
// 'use client'
// import { useState } from 'react';
// import BottomNav from '../../components/BottomNav';
// import Header from '../../components/Header';
//
// export default function LayoutWithBottomNav({ children }) {
//     const [layoutState, setLayoutState] = useState('both'); // 'header', 'bottom', 'both' 중 하나
//     const [headerTitle, setHeaderTitle] = useState('헤더 제목'); // 헤더 제목
//     const [headerMode, setHeaderMode] = useState('헤더 모드'); // 헤더 모드
//
//     return (
//         <>
//             {/* 헤더만 표시 */}
//             {layoutState === 'header' && <Header title={headerTitle} mode={headerMode} />}
//
//             {/* 바텀탭만 표시 */}
//             {layoutState === 'bottom' && <BottomNav />}
//
//             {/* 둘 다 표시 */}
//             {layoutState === 'both' && (
//                 <>
//                     <Header title={headerTitle} mode={headerMode} />
//                     <BottomNav />
//                 </>
//             )}
//
//             {/* 자식 컴포넌트 (페이지 내용) */}
//             {children}
//         </>
//     );
// }
//
