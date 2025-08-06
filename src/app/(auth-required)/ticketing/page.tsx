'use client';

import { FC, useState, useEffect, useRef } from "react";
import { boardData } from "@/data/boardData";
import BoardLayout from "@/components/Layout/BoardLayout";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/api/clients/fetchClient";
import { TicketEvent,  FetchSnackResponse } from "@/interfaces/SnackEvent";

const TicketingPage: FC = () => {
  const board = boardData['ticketing'];
  const router = useRouter();
  const { tabs, type: boardType } = board;
  const hasTabs = tabs.length > 0;
  const defaultTab = hasTabs ? tabs[0].value : "default";

  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [snacks, setSnacks] = useState<TicketEvent[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const isFetching = useRef(false);

  const fetchPosts = async (pageNumber: number) => {
    if (isFetching.current) return;

    try {
      const activePostCategory =
        tabs.find((tab) => tab.value === activeTab)?.postCategory || "";

      console.log("API 호출: 카테고리", activePostCategory, "페이지:", pageNumber);

      setIsLoading(true);
      isFetching.current = true;

      const response = await fetchClient<FetchSnackResponse>(
        `/ticketing/event?campus=${activePostCategory}&page=${pageNumber}`
      );
      const eventList = response.data.eventList;

      if (!Array.isArray(eventList)) {
        console.error('eventList가 배열이 아닙니다:', eventList);
        return;
        }

        if (eventList.length === 0) {
        setHasMore(false);
        } else {
        setSnacks((prev) => [...prev, ...eventList]);
        }
    } catch (e) {
      console.log("이벤트 로딩 실패.", e);
      setHasMore(false);
    } finally {
      isLoading && setIsLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    const initializeBoard = async () => {
      setIsLoading(true);
      try {
        setSnacks([]); // snacks 초기화
        setPage(0);
        setHasMore(true);
        await fetchPosts(0);
      } catch (error) {
        console.error("초기화 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeBoard();
  }, [activeTab]);

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

  useEffect(() => {
    if (page > 0) {
      console.log("페이지 변경: 새 데이터 요청 ->", page);
      fetchPosts(page);
    }
  }, [page]);

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
      {isLoading && (
        <div className="text-center my-4 text-gray-500">로딩 중...</div>
      )}

      {!hasMore && !isLoading && snacks.length === 0 && (
        <div className="text-center my-4 text-gray-500">게시물이 없습니다.</div>
      )}

      <div className="flex flex-col gap-[22px] py-[29px] w-full">
        {snacks.map((snack) => (
          <div
            key={snack.id}
            className="bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] py-[29px] px-4"
            onClick={() => router.push(`/ticketing/${snack.id}`)}
          >
            <div className="flex items-start">
              <p className="font-semibold text-[14px]">{snack.title}</p>
              <p className="text-[25px] text-[#0D99FF] mt-[-17px]"> •</p>
            </div>
            <div className="mt-[22px] text-[12px] text-black">{snack.eventTime}</div>
            <div className="text-[12px] text-black">인천대학교 {snack.campus} {snack.locationInfo}</div>
            <div className="text-[12px] text-black">
              {snack.stock}명
            </div>
          </div>
        ))}
      </div>
    </BoardLayout>
  );
};

export default TicketingPage;
