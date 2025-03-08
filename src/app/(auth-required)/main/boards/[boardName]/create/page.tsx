"use client";
// 생성 페이지
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { boardData } from "@/data/boardData";
import apiClient from "@/api/clients/apiClient"; // apiClient import
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import Tabs from "@/components/Layout/Tabs";
import SmRoundedBtn from "@/components/buttons/smRoundedBtn";

const CreatePostPage = () => {
  const params = useParams();
  const router = useRouter();
  const boardName = params.boardName as string;

  const board = boardData[boardName];

  const handleBack = () => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/\/create$/, "");
    router.push(newPath);
  };

  if (!board) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <h2 className="text-xl font-semibold text-gray-700">
            존재하지 않는 게시판입니다.
          </h2>
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
    postCategory:
        tabs.find((tab) => tab.postCategory === defaultTab)?.postCategory || "",
    anonymous: false,
  });
  const [postImages, setPostImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const selectedCategory =
        tabs.find((tab) => tab.postCategory === activeTab)?.postCategory || "";
    setFormData((prevData) => ({
      ...prevData,
      postCategory: selectedCategory,
    }));
  }, [activeTab, tabs]);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPostImages(files);
      setPreviewImages(files.map((file) => URL.createObjectURL(file)));
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
      const response = await apiClient.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const postId = response?.data?.data?.postId;
      if (postId) {
        const newPath = `/main/boards/${boardName}?postId=${postId}`;
        router.push(newPath);
      }

      previewImages.forEach((url) => URL.revokeObjectURL(url));
      setPreviewImages([]);
      setPostImages([]);
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
            error.response?.data?.message ||
            `HTTP ${error.response?.status}: 응답 없음`;
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
        <Header>
          <Header.BackButton onClick={handleBack} />
          <Header.Title>글 작성하기</Header.Title>
        </Header>
        <DefaultBody hasHeader={1}>
          <div className="flex flex-col gap-[18px] pt-[18px]">
            {hasTabs && (
                <div className="flex gap-[8px] overflow-x-scroll">
                  {tabs.map((tab) =>
                      tab.value === "all" ? null : (
                          <div key={tab.postCategory}>
                            <SmRoundedBtn
                                text={tab.label}
                                onClick={() => setActiveTab(tab.postCategory)}
                                status={activeTab === tab.postCategory ? 1 : 0}
                            />
                          </div>
                      )
                  )}
                </div>
            )}
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
              <div className="flex items-center gap-2 overflow-x-auto">
                {/* 사진 리스트 */}
                {previewImages.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`preview-${index}`}
                        className="w-[100px] h-[100px] object-cover rounded-[5px]"
                    />
                ))}
                {/* 사진 추가 버튼 */}
                <label className="min-w-[52px] h-[52px] ml-6 border border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer">
                  <img src="/icons/board/camera.png" width={18} height={15} />
                  <span className="text-sr text-[12px]">{postImages.length}/10</span>
                  <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                  />
                </label>
              </div>
            </div>
            <textarea
                name="content"
                placeholder="내용을 입력하세요"
                value={formData.content}
                onChange={handleChange}
                className="w-full h-[143px] border border-gray-300 rounded-[5px] p-[16px] text-sm"
            ></textarea>
            <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-[12px] bg-[#0d99ff] text-white rounded-[5px]"
            >
              {isLoading ? "업로드 중..." : "작성 완료"}
            </button>
          </div>
        </DefaultBody>
      </div>
  );
};

export default CreatePostPage;