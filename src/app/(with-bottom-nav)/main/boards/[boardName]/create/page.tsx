"use client";
//생성 페이지
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { boardData } from "@/data/boardData";
import axios from "axios";

const CreatePostPage = () => {
    const params = useParams();
    const boardName = params.boardName as string;

    const board = boardData[boardName];

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

    // 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 파일 업로드 핸들러
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setPostImages(files);

            // 미리보기 URL 생성
            const previewUrls = files.map((file) => URL.createObjectURL(file));
            setPreviewImages(previewUrls);
        }
    };

    // 폼 제출 핸들러
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

        console.log("Submitting formData:", formData);
        console.log("Submitting files:", postImages);

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

            console.log("Post created:", response.data);
            alert("게시물이 성공적으로 업로드되었습니다!");

            // 미리보기 URL 해제
            previewImages.forEach((url) => URL.revokeObjectURL(url));
            setPreviewImages([]);
            setPostImages([]);
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || `HTTP ${error.response?.status}: 응답 없음`;
                console.error("Axios error response:", {
                    status: error.response?.status,
                    headers: error.response?.headers,
                    data: error.response?.data,
                });
                alert(`Error: ${errorMessage}`);
            } else {
                console.error("Unexpected error:", error);
                alert("예상치 못한 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen px-4 py-6">
            {/* 페이지 헤더 */}
            <header className="flex items-center mb-6">
                <button className="text-gray-600 text-lg mr-4">&larr;</button>
                <h1 className="text-xl font-bold text-green-600">&lt;/{board.name}&gt;</h1>
            </header>

            {/* 탭 선택 */}
            {hasTabs && (
                <div className="flex justify-center gap-4 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.postCategory}
                            className={`px-4 py-2 rounded-full text-sm ${
                                activeTab === tab.postCategory
                                    ? "bg-gray-300 text-gray-800"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                            onClick={() => {
                                console.log("Tab selected:", tab.postCategory);
                                setActiveTab(tab.postCategory);
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* 게시글 작성 폼 */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 사진 첨부 */}
                <div className="flex flex-col gap-4">
                    <label className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg text-sm text-gray-500">
                        <span>사진 추가</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {previewImages.map((url, index) => (
                            <img key={index} src={url} alt={`preview-${index}`} className="w-24 h-24 object-cover rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* 제목 입력 */}
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="제목"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-600 text-black"
                        required
                    />
                </div>

                {/* 내용 입력 */}
                <div>
                    <textarea
                        name="content"
                        placeholder="내용을 입력하세요"
                        value={formData.content}
                        onChange={handleChange}
                        className="w-full h-32 border border-gray-300 rounded-lg p-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-600 text-black"
                        required
                    ></textarea>
                </div>

                {/* 익명 여부 */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-gray-600">
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
                            className="mr-2"
                        />
                        익명
                    </label>
                </div>

                {/* 작성 완료 버튼 */}
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 text-white text-sm rounded-lg ${isLoading ? "bg-gray-300" : "bg-gray-400 hover:bg-gray-500"}`}
                    >
                        {isLoading ? "업로드 중..." : "작성 완료"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostPage;
