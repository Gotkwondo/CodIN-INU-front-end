'use client';
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";

export default function MyPage() {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 유저 정보를 가져오는 함수
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("accessToken"); // 토큰 가져오기
                const response = await fetch("https://www.codin.co.kr/api/users", {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`, // Authorization 헤더 추가
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                if (result.success) {
                    setUserData(result.data);
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const menuItems = [
        { label: "프로필 편집", href: "/mypage/edit" },
        { label: "게시글", href: "/mypage/board/posts" },
        { label: "좋아요", href: "/mypage/board/likes" },
        { label: "댓글", href: "/mypage/board/comments" },
        { label: "스크랩", href: "/mypage/board/scraps", isSpacer: true },
        { label: "알림 설정", href: "/mypage/notifications" },
        { label: "차단 관리", href: "/mypage/settings/block", isSpacer: true },
        { label: "로그아웃", href: "/mypage/logout" },
        { label: "회원 탈퇴", href: "/mypage/delete-account" },
    ];

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>유저 정보를 불러올 수 없습니다.</p>
            </div>
        );
    }
    const navigateToMain = () => {
        console.log("메인 페이지로 이동");
    };

    const handleMenuClick = (menuName: string) => {
        alert(`선택: ${menuName}`);
    };
    return (
        <Suspense>
            <Header>
                <Header.Title>마이페이지</Header.Title>
            </Header>

            <DefaultBody hasHeader={1}>

            {/* 사용자 정보 섹션 */}
            <div className="flex items-center justify-between px-4 py-8 pt-[12px]">
                {/* 프로필 이미지 */}
                <div className="flex items-center space-x-4">
                    <div
                        className="w-12 h-12 rounded-full bg-gray-200"
                        style={{
                            backgroundImage: `url(${userData.profileImageUrl || ""})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                    <div>
                        {/* 사용자 이름 */}
                        <h2 className="text-base font-semibold text-gray-800">{userData.name}</h2>
                        {/* 이메일 */}
                        <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                </div>
                {/* 포인트 */}
                <span className="bg-blue-500 text-white text-sm font-bold py-1 px-3 rounded-full">
                    20P
                </span>
            </div>
            {/* 관심사 */}
            <p className="text-sm text-blue-500 text-start ml-4 mt-2 mb-4">
                관심사 · 코딩 · 프론트 · 디자인
            </p>

            {/* 메뉴 리스트 */}
            <ul className="text-sm">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`flex justify-between items-center px-4 py-2 ${
                            item.isSpacer ? "mb-4" : ""
                        }`}
                    >
                        <Link href={item.href} className="text-gray-800">
                            {item.label}
                        </Link>
                        <span className="text-gray-500">&gt;</span>
                    </li>
                ))}
            </ul>
            
            </DefaultBody>

            <BottomNav activeIndex={0}/>
        </Suspense>
    );
}
