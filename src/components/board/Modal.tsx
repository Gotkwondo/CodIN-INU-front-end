'use client';

import { ReactNode, useState } from "react";
import ReportModal from "../modals/ReportModal";
import { PostChatRoom } from "@/api/postChatRoom";
import { boardData } from "@/data/boardData";
import Header from "@/components/Layout/header/Header";

type Post = {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    [key: string]: any; // 추가 데이터 허용
};

const Modal = ({
                   children,
                   onClose,
                   post = { id: '', title: '', content: '', author: '', createdAt: '' },
               }: { children: ReactNode; onClose: () => void; post?: Post }) => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const startChat = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await PostChatRoom(accessToken, post.title, post.userId);

            if (response?.data.data.chatRoomId) {
                window.location.href = `/chat`;
            } else {
                throw new Error("Chat room ID is missing in the response.");
            }
        } catch (error) {
            console.error("채팅방 생성에 실패하였습니다.", error);
        }
    };

    const handleMenuAction = (action: string) => {
        if (action === "chat") {
            startChat();
        } else if (action === "report") {
            setIsReportModalOpen(true);
        } else if (action === "block") {
            alert("차단하기 클릭됨");
        }
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
    };

    const getBoardNameByPostCategory = (category: string): string | null => {
        for (const key in boardData) {
            const board = boardData[key];
            const matchingTab = board.tabs.find((tab) => tab.postCategory === category);
            if (matchingTab) {
                return board.name;
            }
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg h-full flex flex-col">
                {/* Header 컴포넌트 사용 */}
                <Header>
                    <Header.BackButton onClick={onClose} />
                    <Header.Title>
                        {getBoardNameByPostCategory(post.postCategory) || "게시물"}
                    </Header.Title>
                    <Header.Menu>
                        <Header.MenuItem onClick={() => handleMenuAction("chat")}>
                            채팅하기
                        </Header.MenuItem>
                        <Header.MenuItem onClick={() => handleMenuAction("report")}>
                            신고하기
                        </Header.MenuItem>
                        <Header.MenuItem onClick={() => handleMenuAction("block")}>
                            차단하기
                        </Header.MenuItem>
                    </Header.Menu>
                </Header>

                {/* 본문 컨텐츠 */}
                <div className="p-4 overflow-y-auto flex-grow">{children}</div>
            </div>

            {/* 신고 모달 */}
            {isReportModalOpen && (
                <ReportModal onClose={closeReportModal} postId={post.id} />
            )}
        </div>
    );
};

export default Modal;
