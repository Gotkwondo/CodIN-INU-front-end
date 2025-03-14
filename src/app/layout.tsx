import './globals.css';
import { ReactNode } from 'react';
import { UserProvider } from '@/context/UserContext';
import BottomNav from '../components/Layout/BottomNav';
import { AuthProvider } from '@/context/AuthContext';
import type { Viewport } from 'next'
import ReviewProvider from '@/context/WriteReviewContext';
 

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html id="scrollbar-hidden" lang="ko" className="w-full h-full relative">
            <head>
                <title>인천대학교 정보대 SNS</title>
            </head>
            <AuthProvider>
                <UserProvider>
                    <ReviewProvider>
                        <body
                            id="scrollbar-hidden"
                            className="bg-white max-w-full min-h-full relative flex justify-center"
                        >
                            {" "}
                            {/* 바텀 네비게이션 높이만큼 패딩 추가 */}
                            <div className="bg-white w-full min-h-full max-w-[500px] relative">
                                {children}
                            </div>
                        </body>
                    </ReviewProvider>
                </UserProvider>
            </AuthProvider>
        </html>
    );
}
