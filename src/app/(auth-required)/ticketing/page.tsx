'use client';

import { FC, useState, useEffect, useRef } from "react";
import { boardData } from "@/data/boardData";
import BoardLayout from "@/components/Layout/BoardLayout";
import { useRouter } from "next/navigation";
import { fetchClient } from "@/api/clients/fetchClient";
import { SnackEvent, FetchSnackResponse } from "@/interfaces/SnackEvent";
import { formatDateTimeWithDay } from '@/utils/date';

const TicketingPage: FC = () => {
  const board = boardData['ticketing'];
  const router = useRouter();
  const { tabs } = board;
  const defaultTab = tabs.length > 0 ? tabs[0].value : "default";

  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [snacks, setSnacks] = useState<SnackEvent[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const isFetching = useRef(false);

  const fetchPosts = async (pageNumber: number) => {
    if (isFetching.current) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const activePostCategory =
        tabs.find((tab) => tab.value === activeTab)?.postCategory || "";

      const response = await fetchClient<FetchSnackResponse>(
        `/ticketing/event?campus=${activePostCategory}&page=${pageNumber}`
      );
      console.log(response)
      const eventList = response?.data?.eventList;
      if (!Array.isArray(eventList)) {
        console.error('eventList가 배열이 아닙니다:', eventList);
        setHasMore(false);
        return;
      }

      if (eventList.length === 0) {
        setHasMore(false);
      } else {
        setSnacks((prev) => [...prev, ...eventList]);
      }

    } catch (e) {
      console.error("이벤트 로딩 실패.", e);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  // 초기화
  useEffect(() => {
    const initialize = async () => {
      setSnacks([]);
      setPage(0);
      setHasMore(true);
      await fetchPosts(0);
    };

    initialize();
  }, [activeTab]);

  // 스크롤 처리
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 300 &&
        !isLoading &&
        hasMore &&
        !isFetching.current
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  // 페이지 변경 시
  useEffect(() => {
    if (page > 0) {
      fetchPosts(page);
    }
  }, [page]);

  return (
    <BoardLayout
      board={board}
      activeTab={activeTab}
      onTabChange={(tab) => setActiveTab(tab)}
      showSearchButton={false}
    >
      {isLoading && snacks.length === 0 && (
        <div className="text-center my-4 text-gray-500">로딩 중...</div>
      )}

      {!hasMore && !isLoading && snacks.length === 0 && (
        <div className="text-center my-4 text-gray-500">게시물이 없습니다.</div>
      )}

      <div className="flex flex-col gap-[22px] py-[29px] w-full">
        {snacks.map((snack) => (
          <div
            key={snack.eventId}
            className="bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] py-[29px] px-4"
            onClick={() => router.push(`/ticketing/${snack.eventId}`)}
          >
            <div className="flex items-start">
              <p className="font-semibold text-[14px]">{snack.eventTitle}</p>
              <p className="text-[25px] text-[#0D99FF] mt-[-17px]"> •</p>
            </div>
            <div className="mt-[22px] text-[12px] text-black">{formatDateTimeWithDay(snack.eventEndTime)}</div>
            <div className="text-[12px] text-black">{snack.locationInfo}</div>
            <div className="text-[12px] text-black">{snack.quantity}명</div>
            <div className="text-[12px] text-[#0D99FF]">티켓팅 오픈: {formatDateTimeWithDay(snack.eventTime)}</div>
          </div>
        ))}
      </div>
    </BoardLayout>
  );
};

export default TicketingPage;
