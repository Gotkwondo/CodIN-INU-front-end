'use client';

import Link from 'next/link';
import { FaHome, FaSearch, FaEnvelope, FaUser } from 'react-icons/fa';

interface BottomNavProps {
    activeIndex?: number; // 활성화된 항목의 인덱스, 기본값 설정 가능
}

// 아이콘 경로 정의
const navItems = [
    { name: '메인', href: '/main', icon: FaHome },
    { name: '검색', href: '/search', icon: FaSearch },
    { name: '쪽지', href: '/chat', icon: FaEnvelope },
    { name: '마이페이지', href: '/mypage', icon: FaUser },
];

export default function BottomNav({ activeIndex = 0 }: BottomNavProps) {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 bg-white border-t"
            style={{
                boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)', // 얇고 가벼운 그림자
                height: '60px', // 컴팩트한 높이
            }}
        >
            <ul className="flex justify-around items-center h-full">
                {navItems.map((item, index) => {
                    const isActive = activeIndex === index; // 현재 활성화된 아이템인지 확인
                    const Icon = item.icon;
                    return (
                        <li key={item.name} className="flex-1 text-center">
                            <Link href={item.href} className="flex justify-center items-center h-full">
                                <Icon
                                    className={`text-2xl transition-all duration-200 ${
                                        isActive ? 'text-sky-500' : 'text-gray-400'
                                    }`}
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
