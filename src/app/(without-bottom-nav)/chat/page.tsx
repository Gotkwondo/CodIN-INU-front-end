'use client';
import './chat.css';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import BottomNav from "@/components/BottomNav";
import { AuthContext } from '@/context/AuthContext';
import { GetChatRoomData } from '@/api/chat/getChatRoomData';

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
        message: string;
        currentMessageDate: string;
        notificationEnabled: boolean;
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
            <div className="ChatListCont">
                {chatList.map((data, index) => (
                    <div
                        key={data.chatRoomId} // 여기서 고유한 key를 설정
                        id='chatCont'
                        onClick={() => handleGoChatRoom(data.chatRoomId, data.roomName)}
                    >
                        <div id="profile"></div>
                        <div id="main_cont">
                            <div id="name">{data.roomName}</div>
                            <div id="ment">{data.message}</div>
                        </div>
                        <div id="ect">
                            <div id="time">
                                {new Date(data.currentMessageDate).toLocaleDateString('ko-KR', options)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='chat'>
            <div id='topCont'>
                <button id='back_btn' onClick={() => router.push('/main')}>{`<`}</button>
                <div id='title'>{`<쪽지/>`}</div>
                <button id='searchBtn'></button>
            </div>
            <div id='tag'>{`<ul>`}</div>
            <ChatList chatList={chatList} />
            <div id='tag1'>{`</ul>`}</div>
            <BottomNav activeIndex={2}/>
        </div>
    );
}
