"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// 서버에서 내려주는 데이터 구조에 맞춰 인터페이스 정의
interface ReportDataItem {
  _id: string;
  reportingUserId: string;
  reportedUserId: string;
  reportTargetType: string; // COMMENT, POST, USER, etc
  reportTargetId: string;
  reportType: string; // POLITICAL, ABUSE, ...
  reportStatus: string; // PENDING, RESOLVED, ...
  action: string | null;
}

interface ReportGroup {
  reportTargetId: string; // 예: "67b06d646240d11c3bd29c95"
  count: number; // 해당 대상에 대한 신고 건수
  reports: ReportDataItem[]; // 실제 신고 목록
}

export default function AdminPage() {
  // 신고 데이터 상태
  const [reportGroups, setReportGroups] = useState<ReportGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // (1) 신고 목록 가져오기
  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("로그인이 필요합니다.");

      // GET https://codin.inu.ac.kr/api/reports
      const response = await axios.get("https://codin.inu.ac.kr/api/reports", {
        headers: { Authorization: token },
      });

      const data = response.data;
      if (data.success) {
        // data.data가 [ { reportTargetId, count, reports: [...] }, ... ] 형태
        setReportGroups(data.data || []);
      } else {
        throw new Error(data.message || "신고 데이터를 가져오지 못했습니다.");
      }
    } catch (err: any) {
      console.error("신고 목록 불러오기 오류:", err);
      setError(err.message || "신고 목록 불러오기 중 오류가 발생했습니다.");
      if (axios.isAxiosError(err)) {
        console.error("Axios Error Message:", err.message);
        console.error("Axios Error Code:", err.code);
        console.error("Axios Error Config:", err.config);
        console.error("Axios Error Request:", err.request); // 요청 정보
        console.error("Axios Error Response:", err.response); // 응답 정보

        // 서버에서 보낸 응답 바디 (보통은 err.response?.data)
        console.error("Axios Error Response Data:", err.response?.data);

        // 상태 코드 (404, 500 등)
        console.error("Axios Error Response Status:", err.response?.status);
      } else {
        // Axios 외의 에러
        console.error("Unknown error:", err);
      }

      setError(err.message || "신고 목록 불러오기 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // (2) 마운트 시 데이터 불러오기
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">신고 내역 조회</h1>
        <p className="mt-2 text-gray-600">특정 신고 타입 목록을 조회합니다</p>

        {/* 로딩/에러 처리 */}
        {loading && <p className="mt-4 text-gray-500">불러오는 중...</p>}
        {error && <p className="mt-4 text-red-500">에러: {error}</p>}

        {/* (3) 신고 목록 표시 */}
        <section className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-4">신고 목록</h2>
          {reportGroups.map((group) => (
            <div key={group.reportTargetId} className="border-b py-3">
              {/* 대상 ID, 신고 건수 */}
              <p className="text-sm text-gray-800 mb-1">
                <span className="font-semibold">대상 ID:</span>{" "}
                {group.reportTargetId}{" "}
                <span className="text-gray-500">({group.count}건 신고)</span>
              </p>

              {/* 개별 신고 리스트 */}
              <ul className="pl-4 space-y-2">
                {group.reports.map((report) => (
                  <li key={report._id} className="border p-2 rounded">
                    <p className="text-sm">
                      <strong>신고 ID:</strong> {report._id}
                    </p>
                    <p className="text-sm">
                      <strong>신고 사유:</strong> {report.reportType}
                    </p>
                    <p className="text-sm">
                      <strong>신고 상태:</strong> {report.reportStatus}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>신고자:</strong> {report.reportingUserId} /
                      <strong> 피신고자:</strong> {report.reportedUserId}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>타입:</strong> {report.reportTargetType} (ID:{" "}
                      {report.reportTargetId})
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
