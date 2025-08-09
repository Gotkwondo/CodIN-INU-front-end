'use client';

import { FC, useState, useEffect, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchClient } from "@/api/clients/fetchClient";
import { eventParticipationProfileResponseList, FetchUserResponse } from "@/interfaces/SnackEvent";
import { formatDateTimeWithDay } from "@/utils/date";
import Header from "@/components/Layout/header/Header";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import SearchInput from "@/components/common/SearchInput";
import ChangeStatusModal from "@/components/modals/ticketing/ChangeStatusModal";
import ViewUserSignModal from "@/components/modals/ticketing/ViewUserSignModal";

const TicketingUserListPage: FC = () => {
  const router = useRouter();
  const { eventId } = useParams();
  const [users, setUsers] = useState<eventParticipationProfileResponseList[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isInitialize, setIsInitialize] = useState<boolean>(false);
  const isFetching = useRef(false);
  const [title, setTitle] = useState<string>('');
  const [eventEndTime, setEventEndTime] = useState<string>('');
  const [stock, setStock] = useState<number>();
  const [waitNum, setWaitNum] = useState<number>();
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<eventParticipationProfileResponseList | null>(null);



  useEffect(() => {
  if (!isInitialize) {
    const initialize = async () => {
      setUsers([]);
      setPage(1);
      setHasMore(true);
      setIsInitialize(true);
      await fetchPosts(1);
    };

    initialize();
  }
}, [isInitialize]);


  const fetchPosts = async (pageNumber: number) => {
    if (isFetching.current) return;

    isFetching.current = true;
    setIsLoading(true);

    try {
      const response = await fetchClient<FetchUserResponse>(
        `/ticketing/admin/event/${eventId}/participation?page=${pageNumber}`
      );

      const eventList = response?.data?.eventParticipationProfileResponseList ?? [];
      setEventEndTime(formatDateTimeWithDay(response.data.eventEndTime));
      setTitle(response.data.title);
      setStock(response.data.stock);
      setWaitNum(response.data.waitNum);

      

      if (!Array.isArray(eventList)) {
        console.error("응답 형식이 배열이 아님");
        setHasMore(false);
        return;
      }

      if (eventList.length === 0) {
        setHasMore(false);
      } else {
        setUsers((prev) => [...prev, ...eventList]);
      }

    } catch (e) {
      console.error("참여자 불러오기 실패", e);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300 &&
        !isLoading &&
        hasMore &&
        !isFetching.current
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (page > 1) fetchPosts(page);
  }, [page]);

  // 필터링된 사용자 리스트
  const filteredUsers = searchQuery.trim() === ''
    ? users
    : users.filter((user) => {
        const keyword = searchQuery.toLowerCase();
        const target = `${user.name} ${user.studentId} ${user.department}`.toLowerCase();
        return target.includes(keyword);
      });

  //유저 수령완료로 변경
  const changeUserStatus = (user: eventParticipationProfileResponseList) => {
    setSelectedUser(user);
    setShowChangeModal(true);
  };

  const showUserSign = (user: eventParticipationProfileResponseList) => {
    setSelectedUser(user);
    setShowSignModal(true);
  };


  return (
    <Suspense>
      <Header>
        <Header.BackButton onClick={() => router.back()} />
        <Header.Title>간식나눔</Header.Title>
        <Header.DownloadButton
          endpoint={`/ticketing/ticketing/excel/${eventId}`}
          filename={`${eventEndTime} ${title} 참가자 목록`}
          method="GET"/>
      </Header>

      <DefaultBody hasHeader={1}>
        {isLoading && users.length === 0 && (
          <div className="text-center my-4 text-gray-500">로딩 중...</div>
        )}

        {!hasMore && !isLoading && users.length === 0 && (
          <div className="text-center my-4 text-gray-500">참여자가 없습니다.</div>
        )}

        <SearchInput
          placeholder="검색어를 입력하세요."
          onChange={(query) => setSearchQuery(query)}
        />

        <div className="flex flex-col  w-full border-b-[1px] border-[#d4d4d4] mt-4">
          {filteredUsers.map((user, index) => (
            <div
              key={user.userId}
              className="bg-white py-[6px] flex flex-row border-t-[1px] border-[#d4d4d4] items-center"
            >
              <div className="text-[16px] font-bold text-[#79797B] text-center border-r-[1px] border-[#d4d4d4] p-[21px]">
                {String(index + 1).padStart(3, '0')}
              </div>

              <div className="flex flex-col items-center ml-2 flex-1">
                <span className="text-[12px] text-[#79797B]">{user.department}</span>
                <span className="text-[14px] font-bold text-[#79797B]">{user.name}</span>
                <span className="text-[12px] font-bold text-[#0D99FF]">{user.studentId}</span>
              </div>

              <div>
                {user.imageURL ? (
                  <button className="bg-[#0D99FF] text-white text-[14px] rounded-full px-3 py-[7px]" onClick={()=>showUserSign(user)}>
                    서명 보기
                  </button>
                ) : (
                  <span className="bg-[#EBF0F7] text-[#808080] text-[14px] rounded-full px-3 py-[7px]" onClick={()=>changeUserStatus(user)}>
                    수령 대기
                  </span>
                )}
              </div>
            </div>
          ))}

          {showChangeModal && selectedUser && (
            <ChangeStatusModal
              userInfo={selectedUser}
              eventId={String(eventId)}   // useParams() 보호 차원에서 문자열로 캐스팅
              onClose={() => setShowChangeModal(false)}
              onComplete={() => {
                setShowChangeModal(false);
                window.location.reload();
              }}
            />
          )}

          {showSignModal && selectedUser && (
            <ViewUserSignModal
              userInfo={selectedUser}
              onClose={() => setShowSignModal(false)}
              onComplete={() => {
                setShowSignModal(false);
                window.location.reload();
              }}
            />
          )}


        </div>
      </DefaultBody>
    </Suspense>
  );
};

export default TicketingUserListPage;
