'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import ShadowBox from '@/components/common/shadowBox';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Faq } from '../type';

export default function DeptFaqPage() {
  const param = usePathname();
  const dept = param.split('?dept=')[1] || 'COMPUTER_SCI';

  const [questions, setQuestions] = useState<Faq[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetchClient(`/question?department=${dept}`);
        const data: Faq[] = response.dataList;
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFaqs();
  }, [dept]);

  return (
    <>
      {questions.map(faq => (
        <ShadowBox
          key={faq.id}
          className="p-[20px] mb-[22px]"
        >
          <h3 className="font-bold text-[14px] text-active">
            Q. {faq.question}
          </h3>
          <p className="text-[12px] font-medium text-sub mt-[6px]">
            A. {faq.answer}
          </p>
        </ShadowBox>
      ))}
    </>
  );
}
