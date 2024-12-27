'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSearch, FaEllipsisV } from "react-icons/fa";

interface HeaderProps {
    title: string;
    mode: "search" | "menu";
}

const Header: React.FC<HeaderProps> = ({ title, mode }) => {
    const router = useRouter();

    const handleBack = () => {
        router.back(); // 뒤로가기
    };

    const renderRightIcon = () => {
        if (mode === "search") {
            return <FaSearch className="text-white text-lg cursor-pointer" />; // 검색 아이콘
        } else if (mode === "menu") {
            return <FaEllipsisV className="text-white text-lg cursor-pointer" />; // 메뉴 아이콘
        }
        return null;
    };

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-black text-white shadow-md fixed top-0 left-0 right-0 z-10">
            {/* 왼쪽 뒤로가기 버튼 */}
            <button onClick={handleBack} className="text-white text-lg">
                <FaArrowLeft />
            </button>
            {/* 가운데 타이틀 */}
            <h1 className="text-base font-semibold">{title}</h1>
            {/* 오른쪽 아이콘 */}
            <div>{renderRightIcon()}</div>
        </header>
    );
};

export default Header;
