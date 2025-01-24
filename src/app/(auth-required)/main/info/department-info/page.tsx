"use client";
// 정보대 소개 페이지
import React, { useState, useEffect } from "react";
import axios from "axios";
import Tabs from "@/components/Layout/Tabs";
import Link from "next/link";
import Header from "@/components/Layout/header/Header.tsx"; // Link 추가

export default function DepartmentInfoPage() {
    const [activeTab, setActiveTab] = useState("phoneDirectory");
    const [professorPosts, setProfessorPosts] = useState([]); // 교수님 및 연구실 데이터 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const navigateToMain = () => {
        if (typeof window !== "undefined") {
            window.location.href = "/main";
        }
    };

    const tabs = [
        { label: "전화번호부", value: "phoneDirectory" },
        { label: "교수님 및 연구실", value: "professors" },
    ];

    const departments = [
        {
            id: 1,
            name: "컴퓨터 공학부",
            image: "/images/컴퓨터공학부.png",
            departmentName: "COMPUTER_SCI",
        },
        {
            id: 2,
            name: "임베디드시스템공학과",
            image: "/images/임베디드시스템공학과.png",
            departmentName: "EMBEDDED",
        },
        {
            id: 3,
            name: "정보통신학과",
            image: "/images/정보통신학과.png",
            departmentName: "INFO_COMM",
        },
        {
            id: 4,
            name: "교학실",
            image: "/images/교학실.png",
            departmentName: "IT_COLLEGE",
        },
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
                        setError(response.data.message || "데이터를 가져오는 데 실패했습니다.");
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
        <div className="bg-gray-100 min-h-screen">
            <Header>
                <Header.Title>학과 소개</Header.Title>
                <Header.BackButton  onClick={navigateToMain} />
            </Header>

            <div className={"mt-16"}></div>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === "phoneDirectory" ? (
                    <ul className="grid grid-cols-2 gap-4 m-4">
                        {departments.map((department) => (
                            <li key={department.id}>
                                <Link href={`./department-info/${department.departmentName}`}>
                                    <div className="block p-4 border rounded-lg shadow bg-white cursor-pointer hover:shadow-lg">
                                        <div className="aspect-square flex items-center justify-center bg-gray-50 rounded mb-2">
                                            <img
                                                src={department.image.replace('/public', '')}
                                                alt={department.name}
                                                width={80}
                                                height={80}
                                            />
                                        </div>
                                        <p className="text-center font-medium text-gray-800">
                                            {department.name}
                                        </p>
                                    </div>
                                </Link>
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
