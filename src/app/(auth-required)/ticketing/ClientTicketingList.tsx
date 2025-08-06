'use client';

import { FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BoardLayout from "@/components/Layout/BoardLayout";
import { TicketEvent } from "@/interfaces/SnackEvent";
import { fetchClient } from "@/api/clients/fetchClient";
import { formatDateTimeWithDay } from "@/utils/router/date";

interface Props {
  board: any;
  initialPosts: TicketEvent[];
  defaultTab: string;
}

const ClientTicketingList: FC<Props> = ({ board, initialPosts, defaultTab }) => {
  const { tabs } = board;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [posts, setPosts] = useState<TicketEvent[]>(initialPosts || []);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isFetching = useRef(false);

  const fetchPosts = async (pageNumber: number) => {
    if (isFetching.current) return;
    isFetching.current = true;

    try {
      const category = tabs.find(tab => tab.value === activeTab)?.postCategory || "";

      const res = await fetchClient(`/ticketing/event?campus=${category}&page=${pageNumber}`);
      const json = await res.json();

      if (!json?.content || json.content.length === 0) {
        setHasMore(false);
        return;
      }
      setPosts(prev => [...prev, ...json.content]);
    } catch (err) {
      console.error("데이터 로딩 실패", err);
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !isLoading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (page > 0) fetchPosts(page);
  }, [page]);

  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      setPosts([]);
      setPage(0);
      setHasMore(true);
      await fetchPosts(0);
    };
    loadInitial();
  }, [activeTab]);

  return (
    <BoardLayout board={board} activeTab={activeTab} onTabChange={setActiveTab}>
      {!isLoading && posts.length === 0 && (
        <div className="text-center text-gray-500 mt-[50%]">
          간식나눔 이벤트가 없어요
        </div>
      )}
      <div className="flex flex-col gap-[22px] py-[29px] w-full">
        {posts.map(snack => (
          <div
            key={snack.id}
            onClick={() => router.push(`/ticketing/${snack.id}`)}
            className="bg-white rounded-[15px] shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] py-[29px] px-4"
          >
            <div className="flex items-start">
              <p className="font-semibold text-[14px]">{snack.title}</p>
              <p className="text-[25px] text-[#0D99FF] mt-[-17px]"> •</p>
            </div>
            <div className="mt-[22px] text-[12px] text-black">{formatDateTimeWithDay(snack.eventTime)}</div>
            <div className="text-[12px] text-black">인천대학교 {snack.campus} {snack.locationInfo}</div>
            <div className="text-[12px] text-black">{snack.stock}</div>
          </div>
        ))}
      </div>
    </BoardLayout>
  );
};

export default ClientTicketingList;
