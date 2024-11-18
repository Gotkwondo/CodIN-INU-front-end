// src/app/(with-bottom-nav)/main/boards/layout.tsx

import { ReactNode } from 'react';

export default function BoardsLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            {/* 게시판 공통 헤더 등 */}
            {children}
        </div>
    );
}
