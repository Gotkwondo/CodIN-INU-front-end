'use client';

import React, { FC, useState } from 'react';

import AlarmModal from '@/components/modals/AlarmModal';

const Notice: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button onClick={handleOpenModal}>
        <img
          src="/icons/header/Bell.svg"
          width={21}
          height={21}
        />
      </button>

      {isModalOpen && <AlarmModal onClose={handleCloseModal} />}
    </>
  );
};

export default Notice;
