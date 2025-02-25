"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // useRouter 추가
import axios from "axios";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";

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
        <div className="bg-white min-h-screen min-w-full">

            <Header>
                <Header.BackButton/>
                <Header.Title>{departmentName ? `${departmentNamesMap[departmentName] || departmentName} 정보` : "로딩 중..."}</Header.Title>
            </Header>

            <DefaultBody hasHeader={1}>
                <div className="mt-[18px]"/>
                {loading ? (
                    <p className="text-center text-gray-500 text-lg">로딩 중...</p>
                ) : error ? (
                    <p className="text-center text-red-500 text-lg">{error}</p>
                ) : info ? (
                    <div className=" bg-white rounded-lg w-full">
                        <div className="mb-[32px]">
                            <img
                                src={info.data.img}
                                alt={`${departmentNamesMap[departmentName] || departmentName} 이미지`}
                                className="object-contain w-full"
                            />
                        </div>
                        <div className="flex gap-[12px]">
                            <div>
                                <p className="mb-[2px] text-Mm">전화번호</p>
                                <p className="mb-[2px] text-Mm">fax</p>
                                <p className="mb-[2px] text-Mm">위치</p>
                                <div className="mt-[12px] text-Mm"/>
                                <p className="mb-[2px] text-sr">open</p>
                                <p className="mb-[2px] text-sr">vacation</p>
                            </div>
                            <div>
                                <p className="mb-[2px] text-Mr">{info.data.officeNumber}</p>
                                <p className="mb-[2px] text-Mr">{info.data.fax}</p>
                                <p className="mb-[2px] text-Mr">{info.data.location}</p>
                                <div className="mt-[12px] text-Mr"/>
                                <p className="mb-[2px] text-sr">{info.data.open}</p>
                                <p className="mb-[2px] text-sr">{info.data.vacation}</p>
                            </div>
                        </div>
                        <div className="mt-[32px]">
                            <div className="flex flex-col gap-[24px]">
                                {info.data.officeMember.map((member, index) => (
                                    <div key={index} className="flex gap-[20px]">
                                        <img src="/icons/chat/DeafultProfile.png" className="w-[50px] h-[50px]" width={50} height={50}/>
                                        <div className="text-Mr text-[#404040]">
                                            <p className="text-Lm text-black">{member.name}</p>
                                            <p >{member.position}</p>
                                            <p>{member.role}</p>
                                            <p>{member.number}</p>
                                            <p><a href={`mailto:${member.email}`} className="">{member.email}</a></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">데이터가 없습니다.</p>
                )}
            </DefaultBody>
        </div>
    );
}
