"use client";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface WebModalHandles {
    openModal: (url: string) => void;
    closeModal: () => void;
}

const WebModal = forwardRef<WebModalHandles>((_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");

    useImperativeHandle(ref, () => ({
        openModal: (url: string) => {
            setUrl(url);
            setIsOpen(true);
        },
        closeModal: () => {
            setIsOpen(false);
        },
    }));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col shadow-xl">
                {/* 모달 헤더 */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">웹 페이지 미리보기</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-black text-2xl"
                        aria-label="모달 닫기"
                    >
                        &times;
                    </button>
                </div>

                {/* iframe 컨테이너 */}
                <div className="flex-1 relative">
                    <iframe
                        src={url}
                        className="absolute inset-0 w-full h-full border-0"
                        title="External content"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>

                {/* 모달 푸터 */}
                <div className="p-3 border-t flex justify-end">
                    <button
                        onClick={() => window.open(url, "_blank")}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        새 창에서 열기
                    </button>
                </div>
            </div>
        </div>
    );
});

WebModal.displayName = "WebModal";

export default WebModal;
