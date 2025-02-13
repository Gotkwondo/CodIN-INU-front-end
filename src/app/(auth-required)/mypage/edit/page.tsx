'use client'
import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import CommonBtn from "@/components/buttons/commonBtn";

const UserInfoEditPage = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        nickname: "",
        department: "",
        profileImageUrl: "",
        email: "",
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [editing, setEditing] = useState(false); // 수정 모드 상태
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    // 기존 유저 정보 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setMessage("로그인이 필요합니다.");
                    return;
                }

                const response = await axios.get("https://www.codin.co.kr/api/users", {
                    headers: {
                        Authorization: token,
                    },
                });

                const userData = response.data.data;
                console.log("User Data:", userData);
                setUserInfo({
                    name: userData.name,
                    nickname: userData.nickname,
                    department: userData.department,
                    profileImageUrl: userData.profileImageUrl || "",
                    email: userData.email || "",  // 이메일 필드를 포함시킴
                });
            } catch (error) {
                setMessage("유저 정보를 가져오는 중 오류가 발생했습니다.");
                console.error(error);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 유저 정보 수정
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setMessage("로그인이 필요합니다.");
                return;
            }

            const userResponse = await axios.put(
                "https://www.codin.co.kr/api/users",
                userInfo,
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("User Info Updated:", userResponse.data);
        } catch (error) {
            setMessage("유저 정보 수정 중 오류가 발생했습니다.");
            console.error(error);
        }

        // 프로필 사진 수정
        if (profileImage) {
            const formData = new FormData();
            formData.append("postImages", profileImage);

            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.error("토큰이 없습니다. 로그인이 필요합니다. 로그인페이지로");
                }
                const imageResponse = await axios.put(
                    "https://www.codin.co.kr/api/users/profile",
                    formData,
                    {
                        headers: {
                            Authorization: token,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                console.log("Profile Image Updated:", imageResponse.data);
            } catch (error) {
                setMessage("프로필 사진 수정 중 오류가 발생했습니다.");
                console.error(error);
            }
        }

        setLoading(false);
        setEditing(false);
        setMessage("수정이 완료되었습니다.");
    };

    // 뒤로 가기 버튼 클릭시 mypage로 이동
    const handleBack = () => {
        router.push("/mypage");
    };

    return (
        <Suspense>
            <Header>
                <Header.BackButton/>
                <Header.Title>유저 정보 수정</Header.Title>
            </Header>
            <DefaultBody hasHeader={1}>

            {/* 프로필 사진 수정 */}
            <div className="flex flex-col items-center mt-[18px]">
                <div className="w-[60px] h-[60px]">
                    {userInfo.profileImageUrl ? (
                        <img
                            src={userInfo.profileImageUrl}
                            alt="Profile Image"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="flex w-full h-full items-center justify-center text-sub text-sr">로딩 중</span>
                    )}
                </div>
                <label
                    htmlFor="profileImage"
                    className="mt-[12px] cursor-pointer text-active text-sr font-medium"
                >
                    프로필 사진 변경
                </label>
                <input
                    type="file"
                    id="profileImage"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* 이름, 닉네임, 학과 수정 박스 */}
            <form onSubmit={handleSubmit} className="w-full mt-[24px] flex flex-col gap-[24px]">
                {/* 이름 */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">이름</label>
                    <input
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        className="defaultInput"
                        disabled={!editing}
                    />
                </div>

                {/* 닉네임 */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        value={userInfo.nickname}
                        onChange={handleInputChange}
                        className="defaultInput"
                        disabled={!editing}
                    />
                </div>

                {/* 학과 */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">학과</label>
                    <input
                        type="text"
                        name="department"
                        value={userInfo.department}
                        onChange={handleInputChange}
                        className="defaultInput"
                        disabled={!editing}
                    />
                </div>

                {/* 이메일 */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">이메일</label>
                    <input
                        type="text"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                        className="defaultInput"
                        disabled={!editing}
                    />
                </div>

                {/* 수정 모드로 전환 */}
                {editing ? (
                    <CommonBtn
                        text="수정완료"
                        status={1}
                        type="submit"
                    />
                    
                ) : (
                    <div className="fixed translate-x-[-20px] px-[20px] bottom-[32px] flex flex-col w-full items-start gap-[8px]">
                        {message && <p className="text-Mm text-active">{message}</p>}
                        <CommonBtn
                            text="수정하기"
                            status={0}
                            onClick={() => setEditing(true)}
                        />
                    </div>
                )}
            </form>
            </DefaultBody>
        </Suspense>
    );
};

export default UserInfoEditPage;
