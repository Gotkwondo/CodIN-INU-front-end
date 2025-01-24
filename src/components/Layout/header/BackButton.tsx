"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BackProps {
    onClick?: () => void;
}

const BackButton: React.FC<BackProps> = ({ onClick }) => {
    const router = useRouter();

    const handleBack = () => {
        onClick ? onClick() : router.back();
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
                className="w-8 h-8"
            />
        </button>
    );
};

export default BackButton;
