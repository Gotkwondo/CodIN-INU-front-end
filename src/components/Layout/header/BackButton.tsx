"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BackProps {
    onClick?: () => void;
}

const BackButton: React.FC<BackProps> = ({ onClick }) => {
    const router = useRouter();

    const handleBack = () => {
        if (onClick) {
            // onClick이 있으면 onClick 메서드 호출
            onClick();
        } else {
            // onClick이 없으면 router.back() 호출
            router.back();
        }
        console.log("BackButton: handleBack");
    };

    return (
        <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 flex items-center"
            aria-label="뒤로가기"
        >
            <img
                src="/icons/back.svg"
                alt="뒤로가기"
                className="w-[32px] h-[32px]"
            />
        </button>
    );
};

export default BackButton;
