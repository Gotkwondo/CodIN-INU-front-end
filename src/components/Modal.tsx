'use client';
import { ReactNode, useState } from "react";
import ReportModal from "./ReportModal";
import {boardData} from "@/data/boardData"; // ReportModal 컴포넌트 임포트

type Post = {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    [key: string]: any; // 추가 데이터 허용
};

const Modal = ({ children, onClose, post = { id: '', title: '', content: '', author: '', createdAt: '' } }: { children: ReactNode; onClose: () => void; post?: Post }) => {
    const handleBack = () => {
        onClose();
    };

    if (typeof window !== "undefined") {
        window.onpopstate = handleBack;
    }

    const [menuOpen, setMenuOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false); // 신고 모달 상태

    const handleMenuAction = (action: string) => {
        if (action === "chat") {
        console.log(post);
        //post.userId로  유저 아이디 가져올수 있음

            alert("채팅하기 클릭됨");
        } else if (action === "report") {
            setIsReportModalOpen(true); // 신고 모달 열기
        } else if (action === "block") {
            alert("차단하기 클릭됨");
        }
        setMenuOpen(false); // 메뉴 닫기
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false); // 신고 모달 닫기
    };


    // postCategory에 해당하는 Board 이름 가져오기 함수
    const getBoardNameByPostCategory = (category: string): string | null => {
        for (const key in boardData) {
            const board = boardData[key];
            const matchingTab = board.tabs.find(tab => tab.postCategory === category);
            if (matchingTab) {
                return board.name; // 상위 Board 이름 반환
            }
        }
        return null; // 일치하는 항목이 없는 경우
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg h-full flex flex-col">
                {/* 헤더 디자인 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-300">
                    <button
                        onClick={onClose}
                        className="text-gray-700 hover:text-gray-900 transition duration-300"
                        aria-label="닫기"
                    >
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
                    <h3 className="text-xl font-semibold text-gray-800">{getBoardNameByPostCategory(post.postCategory)}</h3>
                    <div className="relative">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="메뉴 열기"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-700"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6h.01M12 12h.01M12 18h.01"
                                />
                            </svg>
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-32 z-10">
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => handleMenuAction("chat")}
                                >
                                    채팅하기
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => handleMenuAction("report")}
                                >
                                    신고하기
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => handleMenuAction("block")}
                                >
                                    차단하기
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 본문 컨텐츠 */}
                <div className="p-4 overflow-y-auto flex-grow">
                    {children}
                </div>
            </div>

            {/* 신고 모달 */}
            {isReportModalOpen && (
                <ReportModal
                    onClose={closeReportModal}
                    postId={post.id} // post의 ID 전달
                />
            )}
        </div>
    );
};

export default Modal;
