"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Tabs from "@/components/Tabs";
import { departments } from "@/data/departmentInfo";

export default function DepartmentInfoPage() {
    const [activeTab, setActiveTab] = useState("phoneDirectory");
    const [professorPosts, setProfessorPosts] = useState([]); // 교수님 및 연구실 데이터 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const tabs = [
        { label: "전화번호부", value: "phoneDirectory" },
        { label: "교수님 및 연구실", value: "professors" },
    ];

    useEffect(() => {
        if (activeTab === "professors") {
            const fetchProfessorPosts = async () => {
                setLoading(true);
                setError(null);

                try {
                    const response = await axios.get("https://www.codin.co.kr/api/info/lab");
                    if (response.data.success) {
                        setProfessorPosts(response.data.dataList);
                    } else {
                        throw new Error(response.data.message || "데이터를 가져오는 데 실패했습니다.");
                    }
                } catch (err) {
                    setError(err.message || "알 수 없는 오류가 발생했습니다.");
                } finally {
                    setLoading(false);
                }
            };

            fetchProfessorPosts();
        }
    }, [activeTab]);

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-xl font-bold text-center text-gray-800 mb-4">정보대 소개</h1>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "phoneDirectory" ? (
                <ul className="grid grid-cols-2 gap-4 mt-4">
                    {departments.map((department) => (
                        <li key={department.id}>
                            <div className="block p-4 border rounded-lg shadow bg-white">
                                <div className="aspect-square flex items-center justify-center bg-gray-50 rounded mb-2">
                                    {department.image ? (
                                        <img
                                            src={department.image}
                                            alt={department.name}
                                            className="w-20 h-20 object-contain"
                                        />
                                    ) : (
                                        <span className="text-gray-400">이미지 없음</span>
                                    )}
                                </div>
                                <p className="text-center font-medium text-gray-800">
                                    {department.name}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="mt-4">
                    {loading ? (
                        <p className="text-center text-gray-500">로딩 중...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <ul className="grid grid-cols-1 gap-4">
                            {professorPosts.map((post) => (
                                <li key={post.id} className="p-4 border rounded-lg shadow bg-white">
                                    <h2 className="font-bold text-gray-800">{post.title}</h2>
                                    <p className="text-gray-600 mt-1">{post.content}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        담당 교수: {post.professor}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
