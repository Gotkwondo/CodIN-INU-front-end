// app/snack/[eventId]/page.tsx

import { fetchClient } from '@/api/clients/fetchClient';
import { Suspense } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import SnackDetailClient from './SnackDetailClient';



export default async function SnackDetailPage({ params }:  {params: Promise<{eventId: string}>} ) {
  const {eventId} = await params;
  
  const response = await fetchClient(`/event/${eventId}`);
  const data = await response.json();

  if (!data.success || !data.data) {
    return <div className="text-center mt-10">이벤트 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <Suspense fallback={<LoadingOverlay />}>
      <SnackDetailClient event={data.data} />
    </Suspense>
  );
}
