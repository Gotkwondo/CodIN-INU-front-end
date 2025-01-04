'use client';

import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StackPage {
    id: string;
    content: ReactNode;
}

interface StackNavigationProps {
    initialPage: ReactNode; // 첫 번째 기본 페이지
}

export default function StackNavigation({ initialPage }: StackNavigationProps) {
    const [stack, setStack] = useState<StackPage[]>([
        { id: 'initial', content: initialPage },
    ]);

    // 새 페이지 추가
    const pushPage = (content: ReactNode) => {
        const newPage: StackPage = {
            id: `page-${stack.length + 1}`,
            content,
        };
        setStack([...stack, newPage]);
    };

    // 현재 페이지 제거
    const popPage = () => {
        if (stack.length > 1) {
            setStack(stack.slice(0, -1)); // 마지막 페이지를 제거
        }
    };

    return (
        <div className="relative w-full h-full">
            <AnimatePresence>
                {stack.map((page, index) => (
                    <motion.div
                        key={page.id}
                        className="absolute inset-0 bg-white shadow-lg"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3 }}
                        style={{ zIndex: index + 1 }}
                    >
                        {React.cloneElement(page.content as React.ReactElement, {
                            pushPage,
                            popPage,
                        })}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
interface PageProps {
    pushPage: (content: ReactNode) => void;
    popPage: () => void;
}
//
// export function MainPage({ pushPage }: PageProps) {
//     return (
//         <div className="p-4">
//             <h1>메인 페이지</h1>
//             <button
//                 className="mt-4 p-2 bg-blue-500 text-white rounded"
//                 onClick={() =>
//                     pushPage(<DetailPage />) // 새로운 페이지를 스택에 추가
//                 }
//             >
//                 상세 페이지 열기
//             </button>
//         </div>
//     );
// }
//
// export function DetailPage({ popPage }: PageProps) {
//     return (
//         <div className="p-4">
//             <h1>상세 페이지</h1>
//             <button
//                 className="mt-4 p-2 bg-red-500 text-white rounded"
//                 onClick={popPage} // 현재 페이지를 스택에서 제거
//             >
//                 뒤로가기
//             </button>
//         </div>
//     );
// }

