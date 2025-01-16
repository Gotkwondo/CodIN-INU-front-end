'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSearch, FaEllipsisV } from "react-icons/fa";

interface HeaderProps {
    title: string;
    mode: "search" | "menu" | "none" | "back";
}

const Header: React.FC<HeaderProps> = ({ title, mode }) => {
    const router = useRouter();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleBack = () => {
        router.back(); // 뒤로가기
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev); // 메뉴 열기/닫기
    };

    const renderLeftIcon = () => {
        if (mode !== "none") {
            return (
                <button onClick={handleBack} className="text-gray-500 text-xl">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>
            );
        }
        return null;
    };

    const renderRightIcon = () => {
        if (mode === "search") {
            return <FaSearch className="text-gray-500 text-xl cursor-pointer" />;
        } else if (mode === "menu") {
            return (
                <div className="relative">
                    <FaEllipsisV
                        className="text-gray-500 text-xl cursor-pointer"
                        onClick={toggleMenu}
                    />
                    {isMenuOpen && (
                        <div className="absolute top-8 right-0 bg-white text-black shadow-lg rounded-lg w-40 z-20">
                            <ul className="flex flex-col">
                                {/* 메뉴 아이템 주석 처리 */}
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    버튼 1
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    버튼 2
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    버튼 3
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <header className="flex items-center justify-between px-4 py-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
            {/* 왼쪽 뒤로가기 버튼 */}
            <div className="w-8">{renderLeftIcon()}</div>
            {/* 가운데 타이틀 */}
            <h1 className="text-lg font-semibold text-gray-800 text-center">
                &lt;{title}/&gt;
            </h1>
            {/* 오른쪽 아이콘 */}
            <div className="w-8 flex justify-end">{renderRightIcon()}</div>
        </header>
    );
};

export default Header;
