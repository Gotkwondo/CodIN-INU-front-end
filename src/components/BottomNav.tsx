'use client';

import Link from 'next/link';
import Image from 'next/image';

interface BottomNavProps {
    activeIndex: number; // 현재 활성화된 항목의 인덱스
}

// 아이콘 경로 정의
const navItems = [
    { name: '메인', href: '/main', icon: '/icons/home.png' },
    { name: '검색', href: '/search', icon: '/icons/Search.png' },
    { name: '쪽지', href: '/chat', icon: '/icons/Message.png' },
    { name: '마이페이지', href: '/mypage', icon: '/icons/User.png' },
];

export default function BottomNav({ activeIndex }: BottomNavProps) {
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
                    const isActive = activeIndex === index; // 인덱스를 비교해 활성화 상태 확인
                    return (
                        <li key={item.name} className="flex-1 text-center">
                            <Link href={item.href}>
                                <div
                                    className={`flex flex-col items-center ${
                                        isActive ? 'text-sky-500' : 'text-gray-400'
                                    }`}
                                >
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        width={24} // 이미지 크기 설정
                                        height={24}
                                    />
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
