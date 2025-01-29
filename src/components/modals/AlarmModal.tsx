"use client";

import React from "react";

interface ModalProps {
    onClose: () => void; // 모달 닫기 핸들러
}

const AlarmModal: React.FC<ModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-white flex flex-col">
            {/* 헤더 */}
            <header className="flex items-center justify-between h-12 px-4 border-b border-gray-300">
                <button
                    onClick={onClose}
                    className="text-gray-600 hover:text-gray-800"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-lg font-bold text-gray-800">&lt; 알람 &gt;</h1>
                <div className="w-5"></div> {/* 오른쪽 여백 */}
            </header>

            {/* 내용 */}
            <main className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 text-base">알람이 없습니다.</p>
            </main>
        </div>
    );
};

export default AlarmModal;
