'use client'
import './chatRoom.css';
import { useRouter, useParams} from 'next/navigation';
import { useContext, useState, useEffect, useRef, FormEvent } from 'react';
import BottomNav from "@/components/Layout/BottomNav";
import { AuthContext } from '@/context/AuthContext';
import { GetChatData } from '@/api/getChatData';
import * as StompJs from '@stomp/stompjs';
import { Stomp } from '@stomp/stompjs';
import  SockJS from 'sockjs-client';
import { deleteRoom } from '@/api/deleteRoom';
import { PostChatImage } from '@/api/postChatImage';
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
    const { Auth } = authContext;
    const [chatList, setChatList] = useState<any[]>([]); // 타입을 더 구체적으로 지정할 수 있음
    const [accessToken, setToken] = useState<string>('');
   const [title, setTitle] = useState<string>('');
   const [content, setContent] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]); // Message 타입 배열
    const [page, setPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const chatBoxRef = useRef<HTMLDivElement | null >(null);
    const [stompClient, setStompClient] = useState<any>(null);
   const [myId, setMyID] = useState<string>('');
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const headers = {
        'Authorization': accessToken
    }
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev); // 메뉴 열기/닫기
    };
    const formatCustomDate = (customDate: string) => {
        try {
            const [datePart, timePart] = customDate.split(' ');
            const [hours, minutes] = timePart.split(':').map(Number);

            const period = hours >= 12 ? '오후' : '오전';
            const formattedHours = hours % 12 || 12; // 12시간제 변환
            return `${period} ${formattedHours}:${minutes.toString().padStart(2, '0')}`;
        } catch (error) {
            console.error('날짜 변환 오류:', error);
            return customDate; // 변환 실패 시 원래 값 반환
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(()=>{
        const socket = new SockJS('https://www.codin.co.kr/api/ws-stomp');
        const stomp = Stomp.over(socket);

        setStompClient(stomp);
    },[]);

useEffect(() => {
    console.log('Messages updated:', messages);  // 상태 업데이트 후 메시지 확인
}, [messages]);
useEffect(() => {
    const fetchChatRoomData = async () => {
        try {
            console.log('토큰:', accessToken);
            const title = localStorage.getItem('roomName');
            setTitle(title);

            console.log('전송데이터:', chatRoomId);
            const data = await GetChatData(accessToken, chatRoomId as string, 0);
            console.log(data);

            setMessages((data.data.data.chatting || []).slice().reverse());
            setMyID(data.data.data.currentUserId);
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


const fetchChatRoomData = async (page: number) => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
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
    fetchChatRoomData(page);
}, [page]);

const handleScroll = () => {
    if (!chatBoxRef.current) return;
    const { scrollTop } = chatBoxRef.current;
    if (scrollTop === 0 && hasMore && !isLoading) {
        setPage((prev) => prev + 1); // 다음 페이지 요청
    }
};

    const Message = ({ id, content, createdAt, contentType }: Message) => {
        const messageClass = id != myId ?  'message-left':'message-right' ;
        return (
            <div className={messageClass}>
            {id == myId ? (
               <div className="modi" />
           ) : (
               // me가 아닐 경우에만 profile div를 추가로 표시
               <div id="profile"></div> // 프로필을 나타내는 div, 필요에 따라 수정 가능
           )}
               <div id={id} className={`message_${messageClass}`}>
                   <div className="message-text">
                    {contentType === 'IMAGE' ? (
                        <img src={content} alt="첨부된 이미지" className="message-image" />
                    ) : (
                        content
                    )}
                    </div>
               </div>
               <div id='time'>{createdAt}</div>
           </div>

        );
    };

    const MessageList = ({ messages }: MessageListProps) => {
        const renderMessagesWithDateSeparators = () => {
            const result: JSX.Element[] = [];
            let lastDate: string | null = null;

            messages.forEach((message, i) => {
                const messageDate = message.createdAt.split(' ')[0]; // 메시지 날짜 부분 추출
                console.log(messageDate);
                if ( messageDate !== lastDate) {
                    // 날짜가 바뀌면 새로운 날짜 표시 추가
                    result.push(
                        <div id='date' key={`date-${messageDate}-${i}`} className="date-separator">
                            {messageDate}
                        </div>
                    );
                    lastDate = messageDate;
                }

                // 메시지 추가
                result.push(
                    <Message
                        key={i}
                        id={message.senderId}
                        content={message.content}
                        me={message.me}
                        senderId={''}
                        createdAt={formatCustomDate(message.createdAt)}
                        contentType={message.contentType}
                    />
                );
            });

            return result;
        };

        return (
            <div className="messages" >
                {renderMessagesWithDateSeparators()}
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
        const getCurrentTime = (date:Date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해야 함
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        const handleSubmit = (e: FormEvent) => {
            e.preventDefault();

            const currentTime = new Date();
            const formattedTime = getCurrentTime(currentTime)

            const message: Message = {
                content: messageContent,
                me: true,
                senderId: myId,
                id: '',
                createdAt: formattedTime,
                contentType: 'TEXT',
            };
            if (imageFile) {
                // 이미지가 선택되었으면 Base64로 변환하여 메시지에 포함
                const reader = new FileReader();
                reader.onloadend = () => {
                  const imageBase64 = reader.result as string;
                  const imageMessage: Message = {
                    ...message,
                    content: imageBase64,
                    contentType: 'IMAGE' // 이미지 URL을 추가
                  };
                  onMessageSubmit(imageMessage); // 이미지 메시지 전송
                  PostChatImage(accessToken, imageFile);
                  console.log('이미지 파일 보냄');
                  setImageFile(null); // 이미지 파일 상태 초기화
                };
                reader.readAsDataURL(imageFile); // 파일을 Base64로 읽음
            } else {
                setContent(messageContent);
                 onMessageSubmit(message); // 일반 텍스트 메시지 전송
            }



        };

        const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              const file = e.target.files[0];
              setImageFile(file); // 선택한 파일 상태 업데이트

              // Base64 변환하여 미리보기 설정
              const reader = new FileReader();
              reader.onloadend = () => {
                  setImagePreview(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          };


        return (
         <div id='imagePrevCont'>
                    {imagePreview && (
            <div className="image-preview">
                <button id='imgPrevDelete' onClick={() => {setImagePreview(null); setImageFile(null)}}>x</button> {/* 미리보기 제거 버튼 */}
             <img id='imagePrev' src={imagePreview} alt="미리보기 이미지" />
             </div>
    )}
            <div id='inputCont'>

                 <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={inputRef}
        />
        <button
          id="imageSubmit"
          onClick={() => inputRef.current?.click()} // 이미지 파일 선택
        ></button>
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
            </div>
        );
    };


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
            <div id='topCont'>
                <button id='backBtn' onClick={() => router.push('/chat')}>{`<`}</button>
                <div id='title'>{`<${title}/>`}</div>
                <button id='ect'  onClick={toggleMenu}>...

                </button>
                 {isMenuOpen && (
                            <div className="menuCont">
                                   <ul className="listBox">
                                      {/* 메뉴 아이템 주석 처리 */}
                                      <li className="btn1" onClick={()=>exitRoom(chatRoomId)}>
                                        방 나가기
                                    </li>
                                    {/*}
                                    <li className="btn2">
                                         차단하기
                                    </li>
                                     <li className="btn3">
                                        알림끄기
                                       </li>*/}
                                </ul>
                               </div>
                        )}
            </div>

            <div id='chatBox' ref={chatBoxRef} onScroll={handleScroll}>
            {isLoading && <div className="loading">Loading...</div>}
                <MessageList messages={messages} />
            </div>
            <div id='divider'></div>
            <MessageForm onMessageSubmit={handleMessageSubmit} />
        </div>
    );

}
