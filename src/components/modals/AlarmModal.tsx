"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/header/Header";
import { Notification } from "@/api/notification/getNotificationList";
import { useRouter } from "next/navigation";

// 더미 데이터
const dummyNotifications: Notification[] = [
    {
        id: "1",
        title: "질문합니다",
        message: "댓글이 달렸습니다: 와 이건 진짜 궁금하네요",
        createdAt: new Date().toISOString(),
        isRead: false,
    },
    {
        id: "2",
        title: "질문합니다",
        message: "댓글이 달렸습니다: 본인 상황이신거죠.. 저였는데도 궁금하네요. 더 길게 입력해보겠습니다.",
        createdAt: new Date().toISOString(),
        isRead: false,
    },
    {
        id: "3",
        title: "질문합니다",
        message: "댓글이 달렸습니다: 음 쪽지 드릴게요.",
        createdAt: new Date().toISOString(),
        isRead: true,
    },
    {
        id: "4",
        title: "익명 채팅방",
        message: "새로운 채팅이 있습니다.",
        createdAt: new Date().toISOString(),
        isRead: false,
    },
];

// 읽음 처리 더미 (추후 실제 API 연결)
const markNotificationAsRead = async (notificationId: string) => {
    console.log(`알림 ${notificationId} 읽음 처리`);
    await new Promise((resolve) => setTimeout(resolve, 100)); // simulate network delay
};

interface ModalProps {
    onClose: () => void;
}

const AlarmModal: React.FC<ModalProps> = ({ onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
    const router = useRouter();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setNotifications(dummyNotifications);
            } catch (error) {
                console.error("알림 목록 불러오기 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const filteredNotifications = notifications.filter((n) => {
        if (filter === "all") return true;
        if (filter === "read") return n.isRead;
        if (filter === "unread") return !n.isRead;
    });

    const truncate = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    const handleNotificationClick = async (notification: Notification) => {
        // 먼저 읽음 처리
        if (!notification.isRead) {
            await markNotificationAsRead(notification.id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
            );
        }

        // 채팅/게시글 경로 분기 후 이동
        if (
            notification.title === "익명 채팅방" ||
            notification.message.startsWith("새로운 채팅이 있습니다.")
        ) {
            router.push(`/chat/${notification.id}`);
        } else {
            router.push(`/main/boards/notification/${notification.id}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-white flex flex-col h-screen">
            <Header>
                <Header.BackButton onClick={onClose} />
                <Header.Title>알람</Header.Title>
            </Header>

            {/* 헤더 하단 카테고리 버튼 - 우측 정렬, 크게 */}
            <div className="flex mt-20 justify-start gap-2 px-4 py-3">
                {[
                    { key: "all", label: "전체" },
                    { key: "read", label: "읽음" },
                    { key: "unread", label: "읽지 않음" },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key as "all" | "read" | "unread")}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                            filter === key
                                ? "bg-[#0d99ff] text-white"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <main className="flex-1 overflow-y-auto px-4 pb-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">로딩 중...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">알람이 없습니다.</p>
                    </div>
                ) : (
                    <ul className="space-y-2 mt-2">
                        {filteredNotifications.map((notification) => (
                            <li
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`flex justify-between items-start p-3 rounded-md hover:bg-gray-50 transition cursor-pointer`}
                            >
                                <div className="flex flex-col space-y-0.5">
                                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded w-fit">
                                        소통해요
                                    </span>
                                    <span className="font-semibold text-sm">{notification.title}</span>
                                    <span className="text-xs text-gray-500 max-w-[250px]">
                                        {truncate(notification.message, 30)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end space-y-1 relative">
                                    {!notification.isRead && (
                                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                                    )}
                                    <span className="text-[10px] text-gray-400">1분 전</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default AlarmModal;
