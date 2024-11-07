'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaSearch, FaEnvelope, FaUser } from 'react-icons/fa';

const navItems = [
    { name: '메인', href: '/main', icon: <FaHome /> },
    { name: '검색', href: '/search', icon: <FaSearch /> },
    { name: '쪽지', href: '/messages', icon: <FaEnvelope /> },
    { name: '마이페이지', href: '/mypage', icon: <FaUser /> },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
            <ul className="flex justify-around">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex flex-col items-center py-2 ${
                                    isActive ? 'text-blue-500' : 'text-gray-500'
                                }`}
                            >
                                <div className="text-xl">{item.icon}</div>
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
