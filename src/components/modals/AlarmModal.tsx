"use client";

import { useState } from "react";

interface ReportModalProps {
    onClose: () => void;
    reportTargetType: string;  // 신고 대상 타입: USER, POST, COMMENT, REPLY 등
    reportTargetId: string;    // 신고 대상 ID
}

const ReportModal: React.FC<ReportModalProps> = ({
                                                     onClose,
                                                     reportTargetType,
                                                     reportTargetId,
                                                 }) => {
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // 라디오로 표시할 신고 사유: 표시 라벨과 서버 전송용 값을 매핑
    const reasonOptions = [
        { label: "정치 및 선거운동", value: "POLITICAL" },
        { label: "욕설 및 폭력", value: "ABUSE" },
        { label: "사기 및 사칭", value: "FRAUD" },
        { label: "도배 및 불쾌함", value: "SPAM" },
        { label: "홍보 및 부적절", value: "COMMERCIAL_AD" },
        { label: "음란물 및 불건전", value: "OBSCENE" },
        { label: "기타", value: "ETC" },
    ];

    const handleSubmit = async () => {
        if (!selectedReason) return;

        setIsSubmitting(true);
        try {
            // 백엔드로 보낼 데이터
            const payload = {
                reportTargetType, // 예: "POST"
                reportTargetId,   // 예: "2"
                reportType: selectedReason, // 예: "FRAUD"
            };

            const response = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("신고가 접수되었습니다.");
                onClose(); // 신고 완료 후 모달 닫기
            } else {
                alert("신고에 실패했습니다. 다시 시도해주세요.");
            }
        } catch (error) {
            console.error("신고 처리 중 오류 발생:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                {/* 모달 헤더 */}
                <header className="px-6 py-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">신고하기</h2>
                </header>

                {/* 모달 바디 */}
                <div className="p-6">
                    <div className="space-y-4">
                        {reasonOptions.map((reason) => (
                            <label
                                key={reason.value}
                                className="flex items-center space-x-3 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="reason"
                                    value={reason.value}
                                    onChange={() => setSelectedReason(reason.value)}
                                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">{reason.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 모달 푸터(버튼) */}
                <footer className="flex justify-end px-6 py-4 border-t space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 text-sm text-white rounded ${
                            selectedReason
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-blue-300 cursor-not-allowed"
                        }`}
                        disabled={!selectedReason || isSubmitting}
                    >
                        {isSubmitting ? "신고 중..." : "확인"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ReportModal;
