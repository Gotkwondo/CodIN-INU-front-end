"use client";

import React from "react";
// Header 컴포넌트 임포트
import Header from "@/components/Layout/header/Header";

interface ModalProps {
    onClose: () => void; // 모달 닫기 핸들러
}

const AlarmModal: React.FC<ModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-white flex flex-col h-screen">
            {/* Header로 대체 */}
            <Header>
                <Header.BackButton onClick={onClose} />
                <Header.Title>&lt; 알람 &gt;</Header.Title>
                {/* 필요하다면 SearchButton, Menu 등을 추가할 수 있습니다. */}
            </Header>

            {/* Header가 fixed 레이아웃이므로 메인 콘텐츠에 상단 여백 추가 */}
            <main className="flex-1 flex items-center justify-center mt-12">
                <p className="text-gray-500 text-base">알람이 없습니다.</p>
            </main>
        </div>
    );
};

export default AlarmModal;
