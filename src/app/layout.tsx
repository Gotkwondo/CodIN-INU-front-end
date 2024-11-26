import './globals.css';
import { ReactNode } from 'react';
import { UserProvider } from '@/context/UserContext';
import BottomNav from '../components/BottomNav';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ko">
        <head>
            <title>인천대학교 정보대 SNS</title>
        </head>
        <UserProvider>
        <body className="pb-16"> {/* 바텀 네비게이션 높이만큼 패딩 추가 */}
        {children}
        </body>
        </UserProvider>
        </html>
    );
}
