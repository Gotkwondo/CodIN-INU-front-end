'use client'
import './chatRoom.css';
import { useRouter, useParams} from 'next/navigation';
import { useContext, useState, useEffect, useRef, FormEvent } from 'react';
import BottomNav from "@/components/Layout/BottomNav";
import { AuthContext } from '@/context/AuthContext';
import { GetChatData } from '@/api/chat/getChatData';
import * as StompJs from '@stomp/stompjs';
import { Stomp } from '@stomp/stompjs';
import  SockJS from 'sockjs-client';
import { deleteRoom } from '@/api/chat/deleteRoom';
import { PostChatImage } from '@/api/chat/postChatImage';
import MessageForm from '@/components/chat/MessageForm';
import MessageList from '@/components/chat/MessageList';
import Header from '@/components/Layout/header/Header';
// 메시지 타입 정의
interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAt:string;
    me: boolean;
    imageUrl?: string;
    contentType: string;
}

interface MessageListProps {
    messages: Message[];
}

interface MessageFormProps {
    onMessageSubmit: (message: Message) => void;
}

export default function ChatRoom() {
    const router = useRouter();
    const { chatRoomId } = useParams(); 
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
    }
    const [accessToken, setToken] = useState<string>('');
   const [title, setTitle] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]); // Message 타입 배열
    const [page, setPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const chatBoxRef = useRef<HTMLDivElement | null >(null);
    const [stompClient, setStompClient] = useState<any>(null);
   const [myId, setMyID] = useState<string>('');
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
   
    const headers = {
        'Authorization': accessToken
    }
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev); // 메뉴 열기/닫기
    };
  

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(()=>{
        if (!accessToken) return;

        const socket = new SockJS('https://www.codin.co.kr/api/ws-stomp');
        const stomp = Stomp.over(socket);

        setStompClient(stomp);
    },[accessToken]);

useEffect(() => {
    console.log('Messages updated:', messages);  // 상태 업데이트 후 메시지 확인
}, [messages]);

useEffect(() => {

    const fetchChatRoomData = async() => {
       
        try {
            console.log('토큰:', accessToken);
            const title = localStorage.getItem('roomName');
            setTitle(title);

            console.log('전송데이터:', chatRoomId);
            const data = await GetChatData(accessToken, chatRoomId as string, 0);
            console.log(data);

            setMessages((data.data.data.chatting || []).slice().reverse());
            setMyID(data.data.data.currentUserId);
            setIsLoading(false);
        } catch (error) {
            console.log('채팅 정보를 불러오는 데 실패했습니다.', error);
            
        }

    };

    if (accessToken) {
        fetchChatRoomData();
    }
}, [accessToken, chatRoomId]);

useEffect(() => {
    if (!accessToken || !stompClient || !myId) return;

    console.log('전송 헤더', headers);

    stompClient.connect(headers, (frame) => {
        console.log('connected:', frame);

        stompClient.subscribe(`/queue/`+chatRoomId, (message) => {
            const receivedMessage = JSON.parse(message.body);
            console.log('Received message:', receivedMessage);

            if (receivedMessage.body.data.senderId !== myId) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        id: receivedMessage.body.data.id,
                        senderId: receivedMessage.body.data.senderId,
                        content: receivedMessage.body.data.content,
                        createdAt: receivedMessage.body.data.createdAt,
                        me: false,
                        contentType: receivedMessage.body.data.contentTyp,
                    },
                ]);
            }
        });
    });
}, [accessToken, stompClient, myId, chatRoomId]);


const fetchChattingData = async (page: number) => {
    setIsLoading(true);
    if (!hasMore || isLoading || page == 0) return;

    
    try {
        const data = await GetChatData(accessToken, chatRoomId as string, page);
        const newMessages = data.data.data.chatting || [];
        if (newMessages.length === 0) {
            setHasMore(false); // 더 이상 불러올 데이터가 없음
        } else {
            setMessages((prev) => [...newMessages.reverse(), ...prev]); // 이전 메시지 추가
        }
    } catch (error) {
        console.error('채팅 정보를 불러오는 데 실패했습니다.', error);
    } finally {
        setIsLoading(false);
    }
};


useEffect(() => {
    
    fetchChattingData(page);
}, [page]);

const handleScroll = () => {
    if (!chatBoxRef.current) return;
    const { scrollTop } = chatBoxRef.current;
    if (scrollTop === 0 && hasMore && !isLoading) {
        setPage((prev) => prev + 1); // 다음 페이지 요청
    }
};

 

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

   


    const exitRoom = async(chatRoomId: string | string[] ) => {

            try {
                console.log('토큰:', accessToken);
                const response = await deleteRoom(accessToken, chatRoomId);
                console.log(response);
                router.push('/chat')

            } catch (error) {
                console.log("채팅방 나가기를 실패했습니다.", error);
            }
    }
    const handleMessageSubmit = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        const sendMessage = {
            type: "SEND",
            content: message.content,
            contentType: message.contentType
        }
        console.log(message.contentType);
        stompClient.send(`/pub/chats/` + chatRoomId ,headers,JSON.stringify(sendMessage));
        console.log(message.content);
    };

    return (
        <div className='chatroom'>
            <Header>
                <Header.BackButton/>
                <Header.Title> {`<구해요/>`}</Header.Title>
                <Header.Menu>
                    <Header.MenuItem onClick={() => exitRoom(chatRoomId)}>
                        방 나가기
                    </Header.MenuItem>
                </Header.Menu>
            </Header>
            <div id='chatBox' ref={chatBoxRef} onScroll={handleScroll}>
            {isLoading && <div className="loading">Loading...</div>}
                <MessageList messages={messages} myId={myId} />
            </div>
            <div id='divider'></div>
            <MessageForm onMessageSubmit={handleMessageSubmit} myId={myId} accessToken={accessToken} imageFile={imageFile} setImageFile={setImageFile} />
        </div>
    );

}