"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { PostChatRoom } from "@/api/chat/postChatRoom";
import { boardData } from "@/data/boardData";
import { PostBlockUser } from "@/api/user/postBlockUser";
import { useReportModal } from "@/hooks/useReportModal";
import { Post } from "@/interfaces/Post"; // Post 인터페이스 가져오기

const Modal = ({
                   children,
                   onClose,
                   // ✅ `Post` 인터페이스에 정의된 필드만 포함하여 기본값 설정
                   post = {
                       _id: "", // postId 대신 사용됨
                       title: "",
                       content: "",
                       postCategory: "",
                       createdAt: "",
                       anonymous: false,
                       commentCount: 0,
                       likeCount: 0,
                       scrapCount: 0,
                       postImageUrl: [], // 이미지 URL 배열
                       userId: "",
                       nickname: "", // 닉네임 (익명 여부와 상관없이)
                       userImageUrl: "", // 사용자 프로필 이미지 (옵션)
                       authorName: "", // 작성자 이름 (익명일 경우 빈 문자열)
                       viewCount: 0, // 조회수
                       hits: 0, // 조회수 (대체 가능)
                       userInfo: {
                           like: false, // 사용자가 좋아요를 눌렀는지 여부
                           scrap: false, // 사용자가 북마크했는지 여부
                       },
                   },
               }: {
    children: ReactNode;
    onClose: () => void;
    post?: Post;
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const {
        isOpen: isReportModalOpen,
        openModal: openReportModal,
        closeModal: closeReportModal,
        getModalComponent: getReportModalComponent,
    } = useReportModal();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
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
        try {
            if (
                confirm(
                    "해당 유저의 게시물이 목록에 노출되지 않으며, 다시 해제하실 수 없습니다."
                )
            ) {
                await PostBlockUser(post.userId);
                alert("유저를 차단하였습니다");
            }
        } catch (error: any) {
            console.log("유저 차단에 실패하였습니다.", error);
            const message = error.response?.data?.message;
            alert(message);
        }
    };

    const handleMenuAction = (action: string) => {
        if (action === "chat") {
            startChat();
        } else if (action === "report") {
            openReportModal("POST", post._id);
        } else if (action === "block") {
            blockUser();
        }
        setMenuOpen(false);
    };

    const getBoardNameByPostCategory = (category: string): string | null => {
        for (const key in boardData) {
            const board = boardData[key];
            const matchingTab = board.tabs.find(
                (tab) => tab.postCategory === category
            );
            if (matchingTab) {
                return board.name;
            }
        }
        return null;
    };

    return (
        <div className=" fixed inset-0 bg-black bg-opacity-50 z-50">
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
                    <h3 className="text-xl font-semibold text-gray-800">
                        {getBoardNameByPostCategory(post.postCategory)}
                    </h3>
                    <div className="relative" ref={menuRef}>
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
                <div className="p-4 overflow-y-auto flex-grow">{children}</div>
            </div>

            {/* 신고 모달 */}
            {isReportModalOpen && getReportModalComponent()}
        </div>
    );
};

export default Modal;
