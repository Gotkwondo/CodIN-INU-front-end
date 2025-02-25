'use client';
//import './chat.css';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, Suspense } from 'react';
import BottomNav from "@/components/Layout/BottomNav/BottomNav";
import { AuthContext } from '@/context/AuthContext';
import { GetChatRoomData } from '@/api/chat/getChatRoomData';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import Image from 'next/image';

export default function Chat() {
    const router = useRouter();
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
    }

    const { Auth } = authContext;
    const [chatList, setChatList] = useState<any>([]);
    const [accessToken, setToken] = useState<string>('');
      interface ChatData {
        chatRoomId: string;
        roomName: string;
        lastMessage: string;
        currentMessageDate: string;
        notificationEnabled: boolean;
        unread: number;
    }

    interface ChatListProps {
        chatList: ChatData[];
    }

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        if (!accessToken) return;

        const getChatRoomData = async () => {
            try {
                console.log('토큰:', accessToken);
                const chatRoomData = await GetChatRoomData(accessToken);
                console.log(chatRoomData.data.dataList);
                setChatList(chatRoomData.data.dataList || []);
            } catch (error) {
                console.log("채팅방 정보를 불러오지 못했습니다.", error);
                setChatList([]);
            }
        };

        getChatRoomData();
    }, [accessToken]);

    const handleGoChatRoom = (chatRoomID: string, roomName: string) => {
        // roomName을 state로 넘기는 방법 (localStorage는 사용하지 않음)

        localStorage.setItem('roomName',roomName);
        router.push(`/chatRoom/${chatRoomID}` );
    };

    const ChatList = ({ chatList }: ChatListProps) => {
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        return (
            <div className="flex flex-col w-full gap-[24px] relative mt-[47px]">
                {chatList.map((data, index) => (
                    <div
                        key={data.chatRoomId} // 여기서 고유한 key를 설정
                        className="flex flex-row w-full gap-[13px] relative"
                        onClick={() => handleGoChatRoom(data.chatRoomId, data.roomName)}
                    >
                        <Image src="/icons/chat/deafultProfile.png" width="49" height="49" alt=""/>
                        <div className="flex flex-col gap-[4px]">
                            <div id="name" className="text-Lm" >{data.roomName}</div>
                            <div id="ment" className="text-Mr text-[#808080]">
                                {data.lastMessage && data.lastMessage.startsWith("data:image") ? (
                                    "( 사진 )"
                                ) : (
                                    data.lastMessage
                                    ? data.lastMessage.length > 16
                                        ? `${data.lastMessage.slice(0, 16)}..`
                                        : data.lastMessage
                                    : "(메시지 없음)"
                                )}
                            </div>
                        </div>
                        <div id="ect">
                            <div className="absolute right-0 top-0 text-sr text-[#808080]">
                                {data.currentMessageDate !== null ? (new Date(data.currentMessageDate).toLocaleDateString('ko-KR', options) ) : ( new Date().toLocaleDateString('ko-KR', options))}
                            </div>
                            {data.unread > 0 && (
                                <div className="absolute right-0 bottom-0 text-sr rounded-[44px] bg-[#0D99FF] w-[22px] h-[22px] flex justify-center items-center text-[#FFFFFF]">
                                    {data.unread}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Suspense>
            <Header>
                <Header.Title>{`쪽지`}</Header.Title>
                <Header.SearchButton onClick={() => console.log("검색 버튼 클릭")} />
            </Header>
            <DefaultBody hasHeader={1}>
                <ChatList chatList={chatList} />
            </DefaultBody>
            <BottomNav activeIndex={2}/>
        </Suspense>
    );
}
