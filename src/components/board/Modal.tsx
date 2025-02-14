'use client';
import { ReactNode, useEffect, useRef, useState } from "react";
import ReportModal from "../modals/ReportModal"; // ReportModal 컴포넌트 임포트
import { PostChatRoom } from "@/api/chat/postChatRoom";
import { boardData } from "@/data/boardData"; // ReportModal 컴포넌트 임포트
import { PostBlockUser } from "@/api/user/postBlockUser";
import DefaultBody from "../Layout/Body/defaultBody";
import Header from "../Layout/header/Header";


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
    const [menuOpen, setMenuOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false); // 신고 모달 상태
    const menuRef = useRef<HTMLDivElement | null>(null); // 메뉴 영역 감지용 useRef

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false); // 외부 클릭 시 메뉴 닫기
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const startChat = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const response = await PostChatRoom(accessToken, post.title, post.userId);

            console.log("채팅방 생성이 완료되었습니다");
            if (response?.data.data.chatRoomId) {
                window.location.href = `/chat`;
            } else {
                throw new Error("Chat room ID is missing in the response.");
            }
        } catch (error) {
            console.log("채팅방 생성에 실패하였습니다.", error);
        }
    };

    const blockUser = async () => {
        
        try {if (confirm("해당 유저의 게시물이 목록에 노출되지 않으며, 다시 해제하실 수 없습니다.")) {
           

            await PostBlockUser(post.userId);
            alert("유저를 차단하였습니다");
        }
        } catch (error) {
            console.log("유저 차단에 실패하였습니다.", error);
            const message = error.response.data.message;
            alert(message);
        }
    };

    const handleMenuAction = (action: string) => {
        if (action === "chat") {
            startChat();
        } else if (action === "report") {
            setIsReportModalOpen(true); // 신고 모달 열기
        } else if (action === "block") {
            blockUser();
        }
        setMenuOpen(false); // 메뉴 닫기
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false); // 신고 모달 닫기
    };

    const getBoardNameByPostCategory = (category: string): string | null => {
        for (const key in boardData) {
            const board = boardData[key];
            const matchingTab = board.tabs.find((tab) => tab.postCategory === category);
            if (matchingTab) {
                return board.name; // 상위 Board 이름 반환
            }
        }
        return null; // 일치하는 항목이 없는 경우
    };

    return (
        <div id="scrollbar-hidden" className=" fixed inset-0 bg-white z-50 overflow-y-scroll">
            <Header>
                <Header.BackButton onClick={onClose}/>
                <Header.Title>{getBoardNameByPostCategory(post.postCategory)}</Header.Title>
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
            <DefaultBody hasHeader={1}>
                {/* 본문 컨텐츠 */}
                <div className="pt-[18px] overflow-y-auto">{children}</div>
                {/* 신고 모달 */}
                {isReportModalOpen && (
                    <ReportModal onClose={closeReportModal} postId={post.id} />
                )}
            </DefaultBody>
        </div>
    );
};

export default Modal;
