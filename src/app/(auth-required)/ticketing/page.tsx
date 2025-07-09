"use client";

import { FC, useState, useEffect, useRef } from "react";
import { boardData } from "@/data/boardData";
import { Post } from "@/interfaces/Post";
import BoardLayout from "@/components/Layout/BoardLayout";
import { useRouter } from "next/navigation";

const TicketingPage: FC = () => {

    const dummySnacks = [
  {
    id: 1,
    title: "총장님과 함께하는 중간고사 간식나눔",
    date: "2025.04.16 (수) 17:00",
    location: "인천대학교 송도캠퍼스 17호관 앞",
    quantity: "500명"
  },
  {
    id: 2,
    title: "총장님과 함께하는 중간고사 간식나눔",
    date: "2025.04.16 (수) 17:00",
    location: "인천대학교 송도캠퍼스 17호관 앞",
    quantity: "500명"
  }
];

    const board = boardData['ticketing'];
    const router = useRouter();
    const { tabs, type: boardType } = board;
    const hasTabs = tabs.length > 0;
    const defaultTab = hasTabs ? tabs[0].value : "default";

    const [activeTab, setActiveTab] = useState<string>(defaultTab);
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const isFetching = useRef(false);

    // // 게시물 요청 함수
    // const fetchPosts = async (pageNumber: number) => {
    //     // 이미 요청 중이면 중복 요청 방지
    //     if (isFetching.current) return;

    //     try {
    //         const activePostCategory =
    //             tabs.find((tab) => tab.value === activeTab)?.postCategory || "";

    //         console.log("API 호출: 카테고리", activePostCategory, "페이지:", pageNumber);

    //         setIsLoading(true);
    //         isFetching.current = true;

    //         // apiClient 사용
    //         const response = await apiClient.get("/posts/category", {
    //             params: {
    //                 postCategory: activePostCategory,
    //                 page: pageNumber,
    //             },
    //         });

    //         if (response.data.success) {
    //             const contents = Array.isArray(response.data.data.contents)
    //                 ? response.data.data.contents
    //                 : [];

    //             console.log("가져온 데이터:", contents);

    //             setPosts((prevPosts) => [...prevPosts, ...contents]);

    //             if (response.data.data.nextPage === -1) {
    //                 setHasMore(false);
    //                 console.log("더 이상 데이터가 없습니다.");
    //             }
    //         } else {
    //             console.error("데이터 로드 실패:", response.data.message);
    //         }
    //     } catch (error: any) {
    //         console.error("API 호출 오류:", error);
    //         // 401 에러 등의 처리는 apiClient 내부 인터셉터에서 처리 가능
    //     } finally {
    //         setIsLoading(false);
    //         isFetching.current = false;
    //     }
    // };


    // // 게시판 초기화
    // useEffect(() => {
    //     const initializeBoard = async () => {
    //         setIsLoading(true);
    //         try {
    //             setPosts([]); // 기존 게시물 목록 초기화
    //             setPage(0);
    //             setHasMore(true);
    //             await fetchPosts(0); // 첫 페이지부터 로드
    //         } catch (error) {
    //             console.error("초기화 실패:", error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     initializeBoard();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [boardName, activeTab]);

    // 스크롤에 의한 무한 스크롤 처리
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 300 &&
                !isLoading &&
                hasMore &&
                !isFetching.current
            ) {
                console.log("스크롤 이벤트: 다음 페이지 로드");
                setPage((prevPage) => prevPage + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isLoading, hasMore]);

    // // page 변경 시 새로운 데이터 요청
    // useEffect(() => {
    //     if (page >= 0) {
    //         console.log("페이지 변경: 새 데이터 요청 ->", page);
    //         fetchPosts(page);
    //     }
    // }, [page]);

    return (
        <BoardLayout
            board={board}
            activeTab={activeTab}
            onTabChange={(tab) => {
                console.log("탭 변경:", tab);
                setActiveTab(tab);
            }}
            showSearchButton={false}
            
        >

            {/* 로딩 상태 표시 */}
            {isLoading && (
                <div className="text-center my-4 text-gray-500">로딩 중...</div>
            )}

            {/* 데이터가 없을 때 안내 메시지 */}
            {!hasMore && !isLoading && posts.length === 0 && (
                <div className="text-center my-4 text-gray-500">
                    게시물이 없습니다.
                </div>
            )}

             <div className="flex flex-col gap-[22px]  py-[29px] w-[100%]">
                {dummySnacks.map(snack => (
                    <div key={snack.id} className="bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] py-[29px] px-4"
                        onClick={()=>router.push(`/ticketing/${snack.id}`)}>
                    <div className="flex items-start">
                        <p className="font-semibold text-[14px]">{snack.title} </p>
                        <p className="text-[25px] text-[#0D99FF] mt-[-17px]"> •</p>
                    </div>
                    <div className="mt-[22px] text-[12px] text-black">{snack.date}</div>
                    <div className="text-[12px] text-black">{snack.location}</div>
                    <div className="text-[12px] text-black">{snack.quantity}</div>
                    </div>
                ))}
            </div>


        </BoardLayout>
    );
};

export default TicketingPage;