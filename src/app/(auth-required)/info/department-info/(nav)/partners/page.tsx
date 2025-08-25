'use client';

import { fetchClient } from '@/api/clients/fetchClient';
import { PartnerLinkCard } from '@/components/info/partner/PartnerLinkCard';
import { IPartners } from '@/interfaces/partners';
import { useEffect, useState } from 'react';

export default function Partners() {
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [partners, setPartners] = useState<IPartners[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchClient('/info/partner');

        console.log('Fetched partner data:', res.dataList);
        setPartners(res.dataList);
      } catch (err) {
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ul className="grid grid-cols-2 place-items-center gap-[11px] w-full">
      {/* LinkCard 컴포넌트화 */}
      {partners.map(partner => (
        <li
          key={partner.id}
          className="flex justify-center items-center"
        >
          <PartnerLinkCard partner={partner} />
        </li>
      ))}
    </ul>
  );
}
