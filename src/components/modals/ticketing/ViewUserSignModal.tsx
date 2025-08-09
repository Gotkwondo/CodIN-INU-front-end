// components/UserInfoModal.tsx
'use client';
import { FC, useState, useRef } from 'react';
import { fetchClient } from '@/api/clients/fetchClient';
import SignatureCanvas from 'react-signature-canvas';
interface ViewUserSignModalProps {
  userInfo:{
    userId: number;
    department: string;
    name: string;
    studentId: string;
    imageURL: string;
  }
  onClose: () => void;
  onComplete: () => void;
}

const ViewUserSignModal: FC<ViewUserSignModalProps> = ({ onClose, onComplete, userInfo}) => {
    const [step, setStep] = useState<1 | 2>(1);
    const sigCanvasRef = useRef<SignatureCanvas>(null);
  
    const handleClear = () => {
      sigCanvasRef.current?.clear();
    };


  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 ">
        <div className="bg-white rounded-2xl w-[80%] px-6 py-[14px] shadow-xl text-center relative max-w-[500px]">
        
        {/* 닫기 버튼 */}
        <button className="absolute top-3 right-3 text-gray-400" onClick={onClose}>
          ✕
        </button>
        
          {/* STEP 1 - Intro */}
        {step === 1 && (
          <>

          <button className='text-[14px] text-white rounded-[20px] bg-[#0D99FF] py-2'>서명 보기</button>
      
        {/* 사용자 정보 */}

            <div className=' flex flex-col'>
                <div className='text-[12px] text-[#79797B]'>{userInfo.department}</div>
                <div className='text-[14px] text-[#79797B] font-bold'>{userInfo.name}</div>
                <div className='text-[12px] text-[#0D99FF] font-bold'>{userInfo.studentId}</div>
            </div>

        
        {/* 사인이미지 */}
        <div className="bg-white rounded-2xl w-[80%] px-6 py-[14px] shadow-xl text-center relative max-w-[500px]">
            <img src={userInfo.imageURL}></img>
        </div>

        

           
      </>)}

       {/* STEP 2 - 서명 크게보기 */}
        {step === 2 && (
         <>
          
            {/* 서명 캔버스 */}
                    <div className='flex flex-col justify-center'>
                        <img src={userInfo.imageURL} className='w-full'></img>
                       
                    </div>
        </>
        )}


         </div>
    </div>
  );
};

export default ViewUserSignModal;
