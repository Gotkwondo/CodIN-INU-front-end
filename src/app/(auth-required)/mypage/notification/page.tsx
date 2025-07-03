"use client";
import { useState } from "react";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import { PostSubscribe } from "@/api/fcm/postSubscribe";
import { PostUnsubscribe } from "@/api/fcm/postUnsubscribe";
import BackButton from "@/components/Layout/header/BackButton";

export default function NotificationSettingPage() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleToggleNotification = async () => {
        if (loading) return;
        setLoading(true);
        try {
            if (isSubscribed) {
                await PostUnsubscribe();
            } else {
                await PostSubscribe();
            }
            setIsSubscribed(!isSubscribed);
        } catch (error) {
            console.error(error);
            alert("알림 설정 처리 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header>
                <Header.BackButton/>
                <Header.Title>알림 설정</Header.Title>
            </Header>
            <DefaultBody hasHeader={1}>
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <span className="text-main text-Mm">알림 설정</span>
                    <label className="inline-flex relative items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isSubscribed}
                            onChange={handleToggleNotification}
                        />
                        <div
                            className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-main rounded-full peer peer-checked:bg-main transition-colors`}
                        ></div>
                        <div
                            className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform ${
                                isSubscribed ? "translate-x-full" : ""
                            }`}
                        ></div>
                    </label>
                </div>
            </DefaultBody>
        </>
    );
}
