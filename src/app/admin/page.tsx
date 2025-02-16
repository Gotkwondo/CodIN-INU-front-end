"use client";

import React from "react";
// import { useReportModal } from "@/hooks/useAlarmModal";  // 파일명에 따라 import 경로 조정
import { useReportModal } from "@/hooks/useReportModal";

export default function AdminPage() {
    // openModal("타입", "ID");
    const { openModal, getModalComponent } = useReportModal();

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold">임시 어드민 페이지</h1>
                <p className="mt-2 text-gray-600">작업용 페이지 입니다</p>

                {/* 예: 게시글 ID가 2번인 'POST' 신고 */}
                <button
                    onClick={() => openModal("POST", "2")}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                    게시글(2번) 신고하기
                </button>

                {/* 예: 댓글 ID가 123인 'COMMENT' 신고 */}
                <button
                    onClick={() => openModal("COMMENT", "123")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    댓글(123번) 신고하기
                </button>

                {/* 모달 렌더링 */}
                {getModalComponent()}
            </main>
        </div>
    );
}
