"use client";
//src/app/(with-bottom-nav)/main/boards/[boardName]/create/page.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { boardData } from "@/data/boardData";

const CreatePostPage = () => {
    const params = useParams();
    const boardName = params.boardName as string;

    // 현재 게시판 데이터 가져오기
    const board = boardData[boardName];

    // 존재하지 않는 게시판에 대한 처리
    if (!board) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl font-semibold text-gray-700">존재하지 않는 게시판입니다.</h2>
            </div>
        );
    }

    const tabs = board.tabs;
    const hasTabs = tabs.length > 0; // 탭 존재 여부 확인
    const defaultTab = hasTabs ? tabs[0].value : "default";

    const [activeTab, setActiveTab] = useState<string>(defaultTab); // 활성 탭 상태
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: defaultTab,
        isAnonymous: false,
    });

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            category: activeTab,
        }));
    }, [activeTab]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // API 요청을 추가하거나 필요한 로직을 삽입하세요.
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
                            key={tab.value}
                            className={`px-4 py-2 rounded-full text-sm ${
                                activeTab === tab.value
                                    ? "bg-gray-300 text-gray-800"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                            onClick={() => setActiveTab(tab.value)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 사진 첨부 */}
                <div className="flex items-center">
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-lg text-sm text-gray-500">
                        사진 0/10
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
                        className="w-full border-b border-gray-300 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-600"
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
              className="w-full h-32 border border-gray-300 rounded-lg p-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-600"
              required
          ></textarea>
                </div>

                {/* 익명 여부 */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm text-gray-600">
                        <input
                            type="checkbox"
                            name="isAnonymous"
                            checked={formData.isAnonymous}
                            onChange={(e) =>
                                setFormData((prevData) => ({
                                    ...prevData,
                                    isAnonymous: e.target.checked,
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
                        className="w-full py-3 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500"
                    >
                        작성 완료
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostPage;
