'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import ShadowBox from '@/components/common/shadowBox';
import Title from '@/components/common/title';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Opinion } from '../type';

export default function DeptOpinionPage() {
  const param = usePathname();
  const dept = param.split('?dept=')[1] || 'COMPUTER_SCI';

  const [page, setPage] = useState(0);
  const [voices, setVoices] = useState([]);
  const [myVoice, setMyVoice] = useState('');

  const textarea = useRef<HTMLTextAreaElement>(null);

  const handleResizeHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = 'auto'; // Reset height
      textarea.current.style.height = `${textarea.current.scrollHeight}px`; // Set to scroll height
    }
  };

  interface VoiceEvent extends React.ChangeEvent<HTMLTextAreaElement> {}

  const handleVoice = (e: VoiceEvent): void => {
    setMyVoice(e.target.value);
    handleResizeHeight();
  };

  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        // Fetch opinions from the server (dummy endpoint used here)
        const response = await fetchClient(
          `/voice-box?department=${dept}&page=${page}`
        );
        const data: Opinion = response.data;
        console.log(data);
        setVoices(data.contents);
      } catch (error) {
        console.error('Error fetching opinions:', error);
      }
    };
    fetchOpinions();
  }, []);

  return (
    <>
      <ShadowBox className="py-[14px] px-[20px]">
        <h2 className="text-[14px] font-bold text-center">
          <p>익명으로 질문하세요!</p>
          <Title className="!text-[14px]">
            학생회는 당신의 목소리가 필요합니다
          </Title>
        </h2>
        <form
          // action=""
          className="flex flex-col items-center"
        >
          <textarea
            ref={textarea}
            placeholder="당신의 의견을 들려주세요"
            onChange={handleVoice}
            className={clsx(
              'px-[18px] py-[10px] text-[12px] font-normal text-sub shadow-05134 bg-[#F9F9F9] rounded-[8px] w-full',
              'placeholder:text-center placeholder:leading-[30px] mt-[10px] mb-[15px] resize-none h-[40px]'
            )}
          />
          <button
            type="submit"
            className={clsx(
              'py-[7px] px-[21px] text-[14px] font-medium text-sub text-center rounded-[20px]',
              myVoice.length > 0 ? 'bg-main' : 'bg-sub'
            )}
          >
            전송하기
          </button>
        </form>
      </ShadowBox>
      {voices.length > 0 ? (
        ''
      ) : (
        <div className="text-center mt-[20px] text-sub">
          목소리를 찾을 수 없어요
        </div>
      )}
    </>
  );
}
