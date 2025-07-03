"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Layout/header/Header";
import { GetNotificationList, Notification } from "@/api/notification/getNotificationList";

interface ModalProps {
    onClose: () => void;
}

const AlarmModal: React.FC<ModalProps> = ({ onClose }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await GetNotificationList();
                if (res.success) {
                    setNotifications(res.dataList);
                }
            } catch (error) {
                console.error("알림 목록 불러오기 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="fixed inset-0 bg-white flex flex-col h-screen">
            <Header>
                <Header.BackButton onClick={onClose} />
                <Header.Title>알람</Header.Title>
            </Header>

            <main className="flex-1 overflow-y-auto mt-12 px-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">로딩 중...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">알람이 없습니다.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className={`border rounded-md p-4 shadow-sm ${
                                    notification.isRead ? "bg-gray-100" : "bg-white"
                                }`}
                            >
                                <h3 className="font-semibold text-lg">{notification.title}</h3>
                                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {new Date(notification.createdAt).toLocaleString("ko-KR")}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default AlarmModal;
