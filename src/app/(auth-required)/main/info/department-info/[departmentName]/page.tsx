"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // useRouter 추가
import axios from "axios";

export default function DepartmentPage() {
    const params = useParams(); // URL의 파라미터 가져오기
    const router = useRouter(); // useRouter 초기화

    // departmentName 가져오기 (배열인지 여부 체크 후 처리)
    const departmentName = Array.isArray(params.departmentName)
        ? params.departmentName[0]
        : params.departmentName;

    const [info, setInfo] = useState(null); // 학과 정보 저장
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const departmentNamesMap = {
        "COMPUTER_SCI": "컴퓨터 공학부",
        "INFO_COMM": "정보통신학과",
        "EMBEDDED": "임베디드 시스템 공학과",
        "STAFF": "교직원",
        "IT_COLLEGE": "정보기술 대학"
    };

    useEffect(() => {
        if (!departmentName) {
            console.log("departmentName is not available"); // 디버깅 로그 추가
            return;
        }

        const fetchDepartmentInfo = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`https://www.codin.co.kr/api/info/office/${departmentName}`);

                if (response.data.success) {
                    setInfo(response.data);
                    console.log("API Response:", response.data); // 가져온 데이터 디버깅
                } else {
                    throw new Error(response.data.message || "데이터를 가져오는 데 실패했습니다.");
                }
            } catch (err) {
                console.error("API Error:", err); // 디버깅 로그 추가
                setError(err.message || "알 수 없는 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchDepartmentInfo();
    }, [departmentName]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="relative mb-6">
                <div className="flex items-center bg-gray-100 py-4 px-6 shadow-md rounded">
                    <button
                        onClick={() => router.replace("/main/info/department-info")}
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <span className="text-2xl font-bold">&lt;</span>
                    </button>
                    <h1 className="text-3xl font-extrabold text-center flex-grow text-gray-800">
                        {departmentName ? `${departmentNamesMap[departmentName] || departmentName} 정보` : "로딩 중..."}
                    </h1>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500 text-lg">로딩 중...</p>
            ) : error ? (
                <p className="text-center text-red-500 text-lg">{error}</p>
            ) : info ? (
                <div className="p-6 bg-white rounded-lg">
                    <div className="mb-8">
                        <img
                            src={info.data.img}
                            alt={`${departmentNamesMap[departmentName] || departmentName} 이미지`}
                            className="w-full h-72 object-contain rounded-lg"
                        />
                    </div>
                    <div className="text-gray-800">
                        <h2 className="text-2xl font-bold mb-4">{departmentNamesMap[departmentName] || departmentName}</h2>
                        <p className="mb-2"><strong>위치:</strong> {info.data.location}</p>
                        <p className="mb-2"><strong>전화번호:</strong> {info.data.officeNumber}</p>
                        <p className="mb-2"><strong>팩스:</strong> {info.data.fax}</p>
                        <p className="mb-2"><strong>운영 시간:</strong> {info.data.open}</p>
                        <p className="mb-2"><strong>방학 중 운영 시간:</strong> {info.data.vacation}</p>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">사무실 구성원</h3>
                        <div className="space-y-4">
                            {info.data.officeMember.map((member, index) => (
                                <div key={index} className="border-b pb-4 mb-4">
                                    <p><strong>이름:</strong> {member.name}</p>
                                    <p><strong>직책:</strong> {member.position}</p>
                                    <p><strong>역할:</strong> {member.role}</p>
                                    <p><strong>전화번호:</strong> {member.number}</p>
                                    <p><strong>이메일:</strong> <a href={`mailto:${member.email}`} className="text-blue-500 underline">{member.email}</a></p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">데이터가 없습니다.</p>
            )}
        </div>
    );
}
