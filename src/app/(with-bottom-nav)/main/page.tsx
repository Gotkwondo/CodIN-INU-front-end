'use client'
import {FC, useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import {FaBell, FaEye, FaHeart, FaRegCommentDots,FaRegBell} from "react-icons/fa";
import ZoomableImageModal from "../../../components/ZoomableImageModal";
import {boardData} from "@/data/boardData";
import AlarmModal from "@/components/AlarmModal"; // 알림 아이콘 추가
const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return "방금 전";
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else {
        return `${Math.floor(diffInSeconds / 86400)}일 전`;
    }
};


const menuItems = [
    { label: "구해요", href: "/main/boards/need-help", icon: "/icons/need-help.png" },
    { label: "소통해요", href: "/main/boards/communicate", icon: "/icons/communicate.png" },
    { label: "비교과", href: "/main/boards/extracurricular", icon: "/icons/extracurricular.png" },
    { label: "정보대 소개", href: "/main/info/department-info", icon: "/icons/info.png" },
    { label: "중고책", href: "/main/boards/used-books", icon: "/icons/used-books.png" },
    { label: "익명 채팅방", href: "/main/anonymous/anonymous-chat", icon: "/icons/anonymous-chat.png" },
    { label: "익명 투표", href: "/main/anonymous/anonymous-vote", icon: "/icons/anonymous-vote.png" },
    { label: "수강 후기", href: "/main/info/course-reviews", icon: "/icons/course-reviews.png" },
];

const Calendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    return (
        <section className="my-6">
            <div className="relative w-full mt-4">
                <ZoomableImageModal
                    images={`/images/calendar/calendar_2024_12.jpg`}
                />
            </div>
        </section>
    );
};
const MainPage: FC = () => {
    const [rankingPosts, setRankingPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [hasNewAlarm, setHasNewAlarm] = useState(false); // 알람 여부

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const mapPostCategoryToLabel = (postCategory: string) => {
        for (const boardKey in boardData) {
            const board = boardData[boardKey];
            const tab = board.tabs.find((tab) => tab.postCategory === postCategory);
            if (tab) return board.name;
        }
        return "알 수 없음";
    };

    useEffect(() => {
        const fetchRankingPosts = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    console.error("토큰이 없습니다. 로그인이 필요합니다. 로그인페이지로");
                }
                const response = await fetch("https://www.codin.co.kr/api/posts/top3", {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                console.log(data)
                setRankingPosts(data.dataList || []); // 데이터 구조에 따라 수정
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRankingPosts();
    }, []);


    return (
        <div className="bg-white min-h-screen ">
            {/* 헤더 */}
            <header className="flex items-center justify-between p-4 bg-white shadow-sm">
                <div className="flex items-center">
                    <Image src="/images/codinlogo.png" alt="CodIN Logo" width={160} height={60} />
                </div>
                <div className="relative">
                    {/* 알림 아이콘 */}
                    <button onClick={handleOpenModal} className="text-gray-600 text-2xl">
                        {hasNewAlarm ? (
                            <FaBell className="text-red-500" /> // 새 알람이 있을 때
                        ) : (
                            <FaRegBell /> // 새 알람이 없을 때
                        )}
                    </button>
                </div>
            </header>

            {/* 캘린더 */}
            <section className="p-3">
                <Calendar />
            </section>

            {/* 메뉴 섹션 */}
            <section className="my-6  mx-4 relative flex flex-col">
                {/* 왼쪽 위에 <div> 텍스트 추가 (메뉴 외부, 왼쪽 정렬) */}
                <div className="self-start p-2 text-sm text-gray-700">
                    <span>&lt;div&gt;</span>
                </div>

                {/* 메뉴 아이템 */}
                <div className="grid grid-cols-4 gap-4  bg-[#ebf0f7] p-4 rounded-lg">
                    {menuItems.map((menu, index) => (
                        <Link
                            href={menu.href}
                            key={index}
                            className="flex flex-col items-center text-center text-gray-700"
                        >
                            <div className="bg-white p-4 rounded-full shadow-md">
                                <Image src={menu.icon} alt={menu.label} width={48} height={48} />
                            </div>
                            {/* 텍스트 줄바꿈 */}
                            <span className="text-sm font-medium mt-2 break-words leading-tight">
                    {menu.label.split(" ").map((word, i) => (
                        <span key={i} className="block">
                            {word}
                        </span>
                    ))}
                </span>
                        </Link>
                    ))}
                </div>

                {/* 오른쪽 아래에 <div> 텍스트 추가 (메뉴 외부, 오른쪽 정렬) */}
                <div className="self-end p-2 text-sm text-gray-700">
                    <span>&lt;/div&gt;</span>
                </div>
            </section>






            {/* 게시물 랭킹 */}
            <section className="my-6">
                <h2 className="text-center text-gray-700 text-lg font-semibold">
                    <span className="text-lg font-light">&lt;best&gt;</span> 게시물 랭킹 <span className="text-lg font-light">&lt;/best&gt;</span>
                </h2>
                <div className="bg-white rounded-lg p-4 shadow-md space-y-1">
                    {loading ? (
                        <p className="text-center text-gray-500">랭킹 데이터를 불러오는 중입니다...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">에러: {error}</p>
                    ) : rankingPosts.length > 0 ? (
                        rankingPosts.map((post, index) => (
                            <div key={index} className="flex items-start px-3 py-1 bg-white border rounded-lg">
                                <div className="flex-1">
                                    <p className="text-[10px] text-gray-500 mb-2 bg-gray-200 inline p-0.5 rounded-sm leading-tight">{mapPostCategoryToLabel(post.postCategory)}</p>
                                    <h3 className="font-semibold text-gray-800 mb-0.5">{post.title}</h3>
                                    <p className="text-gray-600 text-sm mb-1 line-clamp-2">{post.content}</p>
                                    <div className="flex justify-between items-center text-xs text-gray-500 py-1 ">
                                        {/* 왼쪽: 조회, 하트, 댓글 */}
                                        <div className="flex space-x-4">
                                            <span className="flex items-center">
                                              <FaEye className="mr-1" />
                                                {post.hits || 0}
                                            </span>
                                                                                <span className="flex items-center">
                                              <FaHeart className="mr-1" />
                                                                                    {post.likeCount || 0}
                                            </span>
                                                                                <span className="flex items-center">
                                              <FaRegCommentDots className="mr-1" />
                                                                                    {post.commentCount || 0}
                                            </span>
                                        </div>

                                        {/* 오른쪽: 닉네임 | 몇 분 전 */}
                                        <div className="flex items-center space-x-2">
                                            <span>{post.anonymous ? "익명" : post.nickname}</span>
                                            <span>|</span>
                                            <span>{timeAgo(post.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                {post.imageUrl && (
                                    <div className="ml-4 w-16 h-16 overflow-hidden rounded-lg">
                                        <Image
                                            src={post.imageUrl}
                                            alt={post.title}
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">게시물이 없습니다.</p>
                    )}
                </div>
            </section>
            {isModalOpen && <AlarmModal onClose={handleCloseModal} />}
            {/* 하단 네비게이션 */}
            <BottomNav activeIndex={0}/>

        </div>
    );
};

export default MainPage;
