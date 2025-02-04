'use client'

import Header from '@/components/Layout/header/Header';




const courseReviewPage = () => {
  const token = localStorage.getItem("accessToken");
  console.log('dd', token)
  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Header>
        <Header.Title>수강 후기</Header.Title>
        <Header.BackButton />
      </Header>

      
    </div>
  );
}

export default courseReviewPage;