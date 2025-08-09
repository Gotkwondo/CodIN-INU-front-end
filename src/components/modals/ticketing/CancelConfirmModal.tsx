'use client';
import { FC, useState } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
interface CancelConfirmModalProps {
  onClose: () => void;
}

const CancelConfirmModal: FC<CancelConfirmModalProps> = ({
  onClose,
}) => { 



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white w-[75%] max-w-[400px] rounded-xl shadow-lg p-6 relative text-center">

        <img src='/image/ticketing/cancelEmo.svg'></img>
        <p className="text-[13px] font-medium mb-[22px]">
          티켓팅 취소가 완료되었습니다.
        </p>

        
        {/* 확인 버튼 */}
        <button
          className={`w-full h-10 mt-2 font-bold text-[14px] rounded transition-all duration-200`}
          onClick={()=>{
            onClose();
            window.location
          }}
        >
            확인
        </button>

      </div>
    </div>
  );
};

export default CancelConfirmModal;
