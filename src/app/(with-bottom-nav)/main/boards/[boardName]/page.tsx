"use client";

import { useState } from "react";
import Tabs from "@/components/Tabs";
import PostList from "@/components/PostList";
import { departments } from "@/data/departmentInfo";

export default function DepartmentInfoPage() {
    const [activeTab, setActiveTab] = useState("phoneDirectory");

    const tabs = [
        { label: "전화번호부", value: "phoneDirectory" },
        { label: "교수님 및 연구실", value: "professors" },
    ];

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-xl font-bold text-center text-gray-800 mb-4">
                정보대 소개
            </h1>
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
                                {department.location && (
                                    <p className="text-sm text-gray-600 text-center">
                                        위치: {department.location}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="mt-4">
                    {departments
                        .filter((department) => department.professors)
                        .map((department) => (
                            <div key={department.id} className="mb-6">
                                <h2 className="text-lg font-bold text-gray-700">
                                    {department.name}
                                </h2>
                                <ul className="space-y-4">
                                    {department.professors?.map((professor, index) => (
                                        <li
                                            key={index}
                                            className="p-4 bg-white border rounded-lg shadow"
                                        >
                                            <p className="font-medium">{professor.name}</p>
                                            <p className="text-sm text-gray-600">{professor.position}</p>
                                            {professor.phone && (
                                                <p className="text-sm text-gray-600">
                                                    전화: {professor.phone}
                                                </p>
                                            )}
                                            {professor.email && (
                                                <p className="text-sm text-blue-500">
                                                    이메일: {professor.email}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
