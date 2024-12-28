'use client'
import './chat.css';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import BottomNav from "@/components/BottomNav";
import { AuthContext } from '@/context/AuthContext';
import { GetChatRoomData } from '@/api/getChatRoomData';

export default function Chat() {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    
    if (!authContext) {
        throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
    }

    const { Auth } = authContext;
    const [ chatList, setChatList] = useState<any>([]);
    const [accessToken, setToken] = useState<string>('');
   


    interface ChatData {
        chatRoomID : string;
        roomName: string;
        message: string;
        currentMessageDate: string;
        notificationEnabled : boolean;
    }

    interface ChatListProps{
        chatList: ChatData[];
    } 

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setToken(token);
        }
    },[])
   
    useEffect(() => {
        if (!accessToken) return;

        const getChatRoomData = async()=>{
        try{        
            console.log('토큰:', accessToken);
            const chatRoomData = await GetChatRoomData(accessToken);
            console.log(chatRoomData.dataList);
            setChatList(chatRoomData.dataList || []);
        }catch(error){
            console.log("채팅방 정보를 불러오지 못했습니다.", error);
            setChatList([]);
        }
    }

    getChatRoomData();
    }, [accessToken])

    const ChatList = ({chatList}: ChatListProps)=>{
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        return(
            <div className="Chat">
                
                {chatList.map((data, index)=>(
                   <div id='chatCont'>
                    <div id="profile"></div>
                    <div id="main_cont">
                        <div id="name">{data.roomName}</div>
                        <div id="ment">{data.message }</div>
                    </div>
                    <div id="ect">
                        <div id="time">{new Date(data.currentMessageDate).toLocaleDateString('ko-KR', options)}</div>
                       
                    </div>
                </div> 
                ))}
               
            </div>
        );
    }
   
   
    return (
        <div className='chat'>
            <div id='topCont'>
                <button id='back_btn'>{`<`}</button>
                <div id='title'> {`<게시판/>`} </div>
                <button id='searchBtn'></button>
            </div>
            <div id='tag'>{`<ul>`}</div>
            <ChatList chatList={chatList}/>
           <div id='tag1'>{`</ul>`}</div>
           <BottomNav />
        </div>
    );
}
