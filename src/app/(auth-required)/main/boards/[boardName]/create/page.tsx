"use client";
// 생성 페이지
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { boardData } from "@/data/boardData";
import axios from "axios";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import Tabs from "@/components/Layout/Tabs";
import SmRoundedBtn from "@/components/buttons/smRoundedBtn";

const CreatePostPage = () => {
    const params = useParams();
    const router = useRouter();
    const boardName = params.boardName as string;

    const board = boardData[boardName];

    // 뒤로 가기 버튼 핸들러
    const handleBack = () => {
        // 현재 경로에서 "create"를 제외한 경로로 이동
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(/\/create$/, ""); // "create" 제거
        router.push(newPath);
    };

    // 존재하지 않는 게시판 처리
    if (!board) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">존재하지 않는 게시판입니다.</h2>
            </div>
        );
    }

    const { tabs } = board;
    const hasTabs = tabs.length > 0;
    const defaultTab = hasTabs ? tabs[0].postCategory : "default";

    const [activeTab, setActiveTab] = useState<string>(defaultTab);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        postCategory: tabs.find((tab) => tab.postCategory === defaultTab)?.postCategory || "",
        anonymous: false,
    });
    const [postImages, setPostImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const selectedCategory = tabs.find((tab) => tab.postCategory === activeTab)?.postCategory || "";
        setFormData((prevData) => ({
            ...prevData,
            postCategory: selectedCategory,
        }));
    }, [activeTab, tabs]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.postCategory) {
            alert("카테고리가 설정되지 않았습니다. 다시 시도해주세요.");
            return;
        }

        const data = new FormData();
        data.append("postContent", JSON.stringify(formData));
        postImages.forEach((file) => data.append("postImages", file));

        setIsLoading(true);

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("로그인이 필요합니다. 다시 로그인해주세요.");
                return;
            }

            const response = await axios.post("https://www.codin.co.kr/api/posts", data, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            });

            const postId = response?.data?.data?.postId;
            if (postId) {
                const newPath = `/main/boards/${boardName}?postId=${postId}`;
                router.push(newPath); // 생성 성공 후 리다이렉트
            }

            previewImages.forEach((url) => URL.revokeObjectURL(url));
            setPreviewImages([]);
            setPostImages([]);
            const refreshToken = localStorage.getItem('refresh-token');
            localStorage.setItem('accessToken', refreshToken);
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || `HTTP ${error.response?.status}: 응답 없음`;
                alert(`Error: ${errorMessage}`);
            } else {
                alert("예상치 못한 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full">
            {/* 페이지 헤더 */}
            <Header>
                <Header.BackButton onClick={handleBack}/>
                <Header.Title>글 작성하기</Header.Title>
            </Header>
            <DefaultBody hasHeader={1}>
                <div className="flex flex-col gap-[18px] pt-[18px]">
                    {/* 탭 선택 */}
                    {hasTabs && (
                        <div id="scrollbar-hidden" className="flex gap-[8px] overflow-x-scroll">
                            {tabs.map((tab) =>
                                tab.value === "all" ? null : (
                                    <div key={tab.postCategory}>
                                        <SmRoundedBtn text={tab.label} onClick={() => setActiveTab(tab.postCategory)} status={activeTab === tab.postCategory ? 1 : 0}  />
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* 제목 입력 */}
                    <input
                        type="text"
                        name="title"
                        placeholder="제목을 입력하세요"
                        value={formData.title}
                        onChange={handleChange}
                        className="defaultInput"
                    />
                    <div className="flex flex-col gap-[12px]">
                        <h3 className="text-XLm">사진을 추가하세요</h3>
                        {/* 사진 첨부 */}
                        <div className="flex items-center gap-2 w-[52px] h-[52px]">
                            {previewImages.map((url, index) => (
                                <img key={index} src={url} alt={`preview-${index}`} className="w-[52px] h-[52px] object-cover rounded-[5px]" />
                            ))}
                            <label className="w-[52px] h-[52px] border border-gray-300 rounded-md flex flex-col text-sub  items-center justify-center cursor-pointer">
                                <img src="/icons/board/camera.png" width={18} height={15}/> <span className="text-sr text-[12px]">{postImages.length}/10</span>
                                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* 상세 내용 입력 */}
                    <textarea
                        name="content"
                        placeholder="내용을 입력하세요"
                        value={formData.content}
                        onChange={handleChange}
                        className="w-full h-[143px] border border-gray-300 rounded-[5px] p-[16px] text-sm placeholder-gray-400 focus:outline-none focus:border-gray-600 mb-4"
                    ></textarea>

                    {/* 하단 작성 완료 및 익명 */}
                    <div className="fixed bottom-0 left-0 w-full bg-white p-4 flex flex-col items-center">
                        {/* 익명 여부 */}
                        <div className="flex items-center justify-end w-full mb-4">
                            <input
                                type="checkbox"
                                name="anonymous"
                                checked={formData.anonymous}
                                onChange={(e) =>
                                    setFormData((prevData) => ({
                                        ...prevData,
                                        anonymous: e.target.checked,
                                    }))
                                }
                                id="anonymous"
                                className="hidden"
                            />
                            <label
                                htmlFor="anonymous"
                                className={`w-[17px] h-[17px] border-2 rounded-full flex items-center justify-center cursor-pointer transition ${
                                    formData.anonymous
                                        ? "bg-[#0d99ff] border-[#0d99ff]"
                                        : "bg-white border-gray-400"
                                }`}
                            >
                                {formData.anonymous && (
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </label>
                            <span className="ml-[5px] text-Mr text-gray-600">익명</span>
                        </div>

                        {/* 작성 완료 버튼 */}
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-[12px] bg-[#0d99ff] text-white text-sm font-bold rounded-[5px] hover:bg-blue-600"
                        >
                            {isLoading ? "업로드 중..." : "작성 완료"}
                        </button>
                    </div>
                </div>
            </DefaultBody>
        </div>
    );
};

export default CreatePostPage;
