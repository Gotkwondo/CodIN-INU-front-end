'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, Suspense } from 'react';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import SignatureCanvas from 'react-signature-canvas';

export default function SnackDetail() {
    const router = useRouter();

    const sigCanvasRef = useRef<SignatureCanvas>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);

    const handleClear = () => {
        sigCanvasRef.current?.clear();
        setImageURL(null);
    };

    const handleConfirm = async () => {
        if (!sigCanvasRef.current?.isEmpty()) {
        const dataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');
        setImageURL(dataUrl);

        }}

   

    return (
        <Suspense>
            <Header>
                <Header.BackButton onClick={() => router.back()} />
                <Header.Title>{`서명하기`}</Header.Title>
            </Header>
            <DefaultBody hasHeader={1}>
                 

                 <div className='flex flex-col justify-center'>
                    {/* 서명 캔버스 */}
                    <div className="bg-white w-full aspect-square rounded-xl shadow-[0px_5px_13.3px_4px_rgba(212,212,212,0.59)] mb-2 flex items-center justify-center mt-[15%]">
                        <SignatureCanvas
                        ref={sigCanvasRef}
                        canvasProps={{ className: 'w-full aspect-square rounded-xl' }}
                        backgroundColor="white"
                        penColor="black"
                        />
                        {sigCanvasRef.current?.isEmpty() && (
                        <span className="absolute text-sm text-gray-400">서명을 해주세요</span>
                        )}
                    </div>

                    <div className='font-normal text-[12px] leading-[14px] text-center text-black/50 mt-[26px]'> 수령 확인 및 본인 확인 용도로 사용됩니다.</div>
                    
                 </div>
                 
                <div className="fixed bottom-0 left-0 w-full px-4 bg-white pb-[35px] flex flex-col items-center">
                    
                    <button
                        className="mt-3 w-full h-[50px] bg-[#EBF0F7] text-[#808080] rounded-[5px] text-[18px] font-medium max-w-[500px]"
                        onClick={handleClear}
                    >
                        다시 쓰기
                    </button> 
                    
                    <button className="mt-3 w-full h-[50px] bg-[#0D99FF] text-white rounded-[5px] text-[18px] font-bold max-w-[500px]" onClick={handleConfirm}>
                        확인
                    </button>
                    
                </div>
                {/* <BottomNav /> */}
                
            </DefaultBody>
        </Suspense>
    );
}