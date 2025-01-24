// components/ChatRoomHeader.tsx
'use client';
import '../app/(without-bottom-nav)/chatRoom/[chatRoomId]/chatRoom.css';
import React from 'react';
import { useRouter } from 'next/navigation';

interface ChatRoomHeaderProps {
    title: string;
    onExitRoom: () => void;
    onToggleMenu: () => void;
    isMenuOpen: boolean;
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({ title, onExitRoom, onToggleMenu, isMenuOpen }) => {
    const router = useRouter(); 

    return (
        <div id="topCont" className="flex w-full flex-row justify-between">
            <button id="backBtn" 
                    className="mt-[8.44%] w-[32px] h-[32px] font-serif font-semibold text-[32px] leading-[29px] flex items-center self-start text-[#CCCCCC] ml-[11px]"
                    onClick={() => router.push('/chat')}>{`<`}</button>
            <div    id="title"
                    className="w-auto h-[26px] font-[ABeeZee] font-semibold text-[18px] leading-[21px] tracking-tight text-[#000000] mt-[6.63%]"
                >{`<${title}/>`}</div>
            <button id="ect" onClick={onToggleMenu}>...</button>
            {isMenuOpen && (
                <div className="menuCont">
                    <ul className="listBox">
                        <li className="btn1" onClick={onExitRoom}>방 나가기</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ChatRoomHeader;
