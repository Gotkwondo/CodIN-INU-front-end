'use client'
import './chatRoom.css';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, useRef, FormEvent } from 'react';
import BottomNav from "@/components/BottomNav";
import { AuthContext } from '@/context/AuthContext';

// 메시지 타입 정의
interface Message {
    id: string;
    senderId: string;
    content: string;
    createdAt:string;
    me: boolean;
}

interface MessageListProps {
    messages: Message[];
}

interface MessageFormProps {
    onMessageSubmit: (message: Message) => void;
}

export default function ChatRoom() {
    const router = useRouter();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
    }

    const { Auth } = authContext;
    const [chatList, setChatList] = useState<any[]>([]); // 타입을 더 구체적으로 지정할 수 있음
    const [accessToken, setToken] = useState<string>('');
    const [socket, setSocket] = useState<WebSocket | null>(null); // WebSocket 타입 추가
    const [userType, setUserType] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]); // Message 타입 배열

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setToken(token);
        }
    }, []);

    const Message = ({ id, content, me, createdAt }: Message) => {
        const messageClass = me ? 'message-right': 'message-left' ;
        return (
            <div className={messageClass}>
             {me ? (
                <div className="modi" />
            ) : (
                // me가 아닐 경우에만 profile div를 추가로 표시
                <div id="profile"></div> // 프로필을 나타내는 div, 필요에 따라 수정 가능
            )}
                <div id={id} className={`message_${messageClass}`}>
                    <div className="message-text">{content}</div>
                </div>
                <div id='time'>{createdAt}</div>
            </div>
        );
    };

    const MessageList = ({ messages }: MessageListProps) => {
        return (
            <div className="messages" style={{ overflowY: 'scroll', maxHeight: '660px' }}>
                {messages.map((message, i) => (
                    <Message
                        key={i}
                        id={message.senderId}
                        content={message.content}
                        me={message.me} senderId={''} createdAt={message.createdAt}                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
        );
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const MessageForm = ({ onMessageSubmit }: MessageFormProps) => {
        const [messageContent, setMessageContent] = useState<string>('');
        const [time, setTime] = useState<string>('');
        const inputRef = useRef<HTMLInputElement | null>(null); 
        const getCurrentTime = () => {
            const options: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true, // 12시간 형식 사용
            };
            const currentTime = new Date();
            return currentTime.toLocaleTimeString('ko-KR', options);
        };

        const handleSubmit = (e: FormEvent) => {
            e.preventDefault();

            const currentTime = getCurrentTime();

            const message: Message = {
                content: messageContent,
                me: true // `me` 값을 true로 설정
                ,

                senderId: '',
                id: '',
                createdAt: currentTime
            };
            onMessageSubmit(message);
            setMessageContent('');
           
        };

        return (
            <div id='inputCont'>
             <button id='imageSubmit'></button>
            <form onSubmit={handleSubmit} id='messagesendForm' autoComplete='off'>
                <input
                    id='messageInput'
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="메시지를 입력하세요"
                    autoFocus
                   
                />
                <button type="submit" id='sendBtn'></button>
            </form>
            </div>
        );
    };

    const handleMessageSubmit = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
     
    };

    return (
        <div className='chatroom'>
            <div id='topCont'>
                <button id='backBtn'>{`<`}</button>
                <div id='title'>{`<익명/>`}</div>
                <button id='ect'>...</button>
            </div>
            <div id='date'>2024.11.26</div>
            <div id='chatBox'>
                <MessageList messages={messages} />
            </div>
            <div id='divider'></div>
            <MessageForm onMessageSubmit={handleMessageSubmit} />
        </div>
    );
}
