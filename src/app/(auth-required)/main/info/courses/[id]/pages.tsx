'use client';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Header from '@/components/Layout/header/Header';
import { Suspense, use } from 'react';

export default function CourseDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense>
      <Header>
        <Header.BackButton />
        <Header.Title>교과목 검색 및 추천 </Header.Title>
      </Header>
      <DefaultBody hasHeader={1}></DefaultBody>
    </Suspense>
  );
}
