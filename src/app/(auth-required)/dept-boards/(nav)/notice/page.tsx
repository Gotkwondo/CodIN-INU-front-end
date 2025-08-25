'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import ShadowBox from '@/components/common/shadowBox';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NoticeData } from '../type';

function timeAgo(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime(); // 밀리초 차이
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}일 전`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}개월 전`;

  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears}년 전`;
}

export default function DeptNoticePage() {
  const param = usePathname();
  const dept = param.split('?dept=')[1] || 'COMPUTER_SCI';

  const [notices, setNotices] = useState<NoticeData[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        const response = await fetchClient(
          `/notice/category?department=${dept}&page=${page}`
        );
        const data: NoticeData[] = response.data.contents;
        console.log(data);
        setNotices(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchNoticeData();
  }, []);

  return (
    <>
      {notices &&
        notices.length > 0 &&
        notices.map((item, index) => (
          <Link
            key={index}
            href={`/dept-boards/q/${item._id}?dept=${dept}`}
            className="mb-[22px]"
          >
            <ShadowBox className="p-[20px]">
              <div className="text-[14px] font-bold">{item.title}</div>
              <div className="mt-[10px] mb-[22px] text-[12px] font-normal overflow-ellipsis line-clamp-3">
                {item.content}
              </div>
              <div className="absolute bottom-[14px] right-[20px] text-[10px] text-[#AEAEAE]">
                {item.nickname} | {timeAgo(item.createdAt)}
              </div>
            </ShadowBox>
          </Link>
        ))}
    </>
  );
}
