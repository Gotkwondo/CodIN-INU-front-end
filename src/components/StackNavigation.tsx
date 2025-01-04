'use client';

import React, { ReactElement, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StackPage {
    id: string;
    content: ReactElement; // ReactNode 대신 ReactElement로 제한
}

interface StackNavigationProps {
    initialPage: ReactElement; // 첫 번째 기본 페이지
}

export default function StackNavigation({ initialPage }: StackNavigationProps) {
    const [stack, setStack] = useState<StackPage[]>([
        { id: 'initial', content: initialPage },
    ]);

    // 새 페이지 추가
    const pushPage = (content: ReactElement) => {
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
                        {React.cloneElement(page.content, {
                            pushPage,
                            popPage,
                        } as PageProps)}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

interface PageProps {
    pushPage: (content: ReactElement) => void;
    popPage: () => void;
}
