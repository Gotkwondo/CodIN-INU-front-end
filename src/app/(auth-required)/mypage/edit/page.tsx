'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
        <div className="bg-white min-h-screen px-4 py-6 flex flex-col items-center">
            {/* 헤더 */}
            <header className="flex items-center justify-between w-full p-4 bg-white shadow-sm mb-6">
                <button onClick={handleBack} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">유저 정보 수정</h1>
                <div className="w-5 h-5"></div> {/* 빈 공간 */}
            </header>

            {message && <p className="text-center text-gray-600">{message}</p>}

            {/* 프로필 사진 수정 */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                    {userInfo.profileImageUrl ? (
                        <img
                            src={userInfo.profileImageUrl}
                            alt="Profile Image"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-600">No Image</span>
                    )}
                </div>
                <label
                    htmlFor="profileImage"
                    className="mt-2 cursor-pointer text-blue-500 text-sm"
                >
                    사진 변경
                </label>
                <input
                    type="file"
                    id="profileImage"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* 이름, 닉네임, 학과 수정 박스 */}
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                {/* 이름 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">이름</label>
                    <input
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-600"
                        disabled={!editing}
                    />
                </div>

                {/* 닉네임 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">닉네임</label>
                    <input
                        type="text"
                        name="nickname"
                        value={userInfo.nickname}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-600"
                        disabled={!editing}
                    />
                </div>

                {/* 학과 */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">학과</label>
                    <input
                        type="text"
                        name="department"
                        value={userInfo.department}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-600"
                        disabled={!editing}
                    />
                </div>

                {/* 이메일 */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">이메일</label>
                    <input
                        type="text"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-600"
                        disabled={!editing}
                    />
                </div>

                {/* 수정 모드로 전환 */}
                {editing ? (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-4 bg-blue-500 text-white text-sm font-bold rounded-full hover:bg-blue-600"
                        >
                            저장
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="text-sm text-blue-500"
                        >
                            수정하기
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UserInfoEditPage;
