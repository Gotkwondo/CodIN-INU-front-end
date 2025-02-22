'use client';
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import { PostLogout } from "@/api/user/postLogout";
import { DeleteUser } from "@/api/user/deleteUser";

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
    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            if (confirm("로그아웃 할까요?")) {
                const response = await PostLogout();
                console.log('결과:', response);
                localStorage.clear();
                alert("성공적으로 로그아웃하였습니다.")
                window.location.href = "/login";
            } 
        } catch (error) {
            console.error("로그아웃 실패", error);
            const message = error.response.data.message;
            alert(message);
        }
    };
    const handleDeleteAccount = async(e: React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        try{

            if (confirm("정말로 탈퇴하시겠어요?")) {
                const response = await DeleteUser();
                console.log('결과:', response);
                localStorage.clear();
                alert("성공적으로 탈퇴하였습니다.")

                document.cookie.split(";").forEach((cookie) => {
                    const cookieName = cookie.split("=")[0].trim();
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                });

                window.location.href = "/login";
            } 
        } catch (error) {
            console.error("탈퇴 실패",error);
            const message = error.response.data.message;
            alert(message);
        }
    }
    const menuItems = [
        { label: "프로필 편집", href: "/mypage/edit"},
        { label: "게시글", href: "/mypage/board/posts" },
        { label: "좋아요", href: "/mypage/board/likes", isSpacer: true},
        { label: "스크랩", href: "/mypage/board/scraps", isSpacer: true },
        { label: "알림 설정", href: "/mypage/notifications" },
        { label: "차단 관리", href: "/mypage/settings/block", isSpacer: true },
        { label: "로그아웃", onclick: handleLogout },
        { label: "회원 탈퇴", onclick: handleDeleteAccount },
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
            <div className="flex items-center justify-between pt-[18px]">
                
                {/* 프로필 이미지 */}
                <div className="flex items-center space-x-[12px]">
                    <img 
                        className="rounded-full"
                        src={userData.profileImageUrl}
                        width={49} height={49}
                    />
                    <div>
                        {/* 사용자 이름 */}
                        <h2 className="text-main text-Mm">{userData.name}</h2>
                        {/* 이메일 */}
                        <p className="text-sub text-sr">{userData.email}</p>
                    </div>
                </div>
                <p className="text-Mm text-[#fff] bg-main px-[8px] py-[2px] rounded-[50px] flex justify-center items-center">
                    인증됨
                </p>
            </div>

            {/* 메뉴 리스트 */}
            <ul className="mt-[45px] text-Mm ">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`flex justify-between items-center w-full
                            ${ item.isSpacer ? "mb-[48px] " : "mb-[24px] "}
                        `}
                    >
                        {item.onclick ? (
                                <button onClick={(e)=> item.onclick(e)} >
                                    {item.label}
                                </button>
                            ) : (
                                <Link href={item.href} 
                                    className={`
                                        ${ item.label === "프로필 편집" ? " text-active" : "text-main"}
                                    `}>
                                    {item.label}
                                </Link>
                            )}
                        <img src="/icons/mypage/rightArrow.svg" width={20} height={20}/>
                    </li>
                ))}
            </ul>
            
            </DefaultBody>

            <BottomNav activeIndex={3}/>
        </Suspense>
    );
}
