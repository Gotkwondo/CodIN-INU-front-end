'use client'
import './chat.css';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

export default function Chat() {
    const router = useRouter();
    
    const [email, setEmail] = useState<string>("");
    const [isMailSent, setMailSent] = useState<boolean>(false);
    const hadleInputChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        setEmail(e.target.value);
    };


    interface ChatData {
        title: string;
        lastChatMessage: string;
        lastChatMessageDate: string;
    }

    interface ChatListProps{
        chatList: ChatData[];
    } 
   
    const dummy:ChatData[] = [
        {title: '게시글 제목',
            lastChatMessage: '최근 보낸 카톡 내역',
            lastChatMessageDate:'오후 21:39'
        },
        {title: '게시글 제목',
            lastChatMessage: '최근 보낸 카톡 내역',
            lastChatMessageDate:'오후 21:39'
        },
        {title: '게시글 제목',
            lastChatMessage: '최근 보낸 카톡 내역',
            lastChatMessageDate:'오후 21:39'
        },
        {title: '게시글 제목',
            lastChatMessage: '최근 보낸 카톡 내역',
            lastChatMessageDate:'오후 21:39'
        },
        {title: '게시글 제목',
            lastChatMessage: '최근 보낸 카톡 내역',
            lastChatMessageDate:'오후 21:39'
        },
        {title: '게시글 제목',
            lastChatMessage: '최근 보낸 카톡 내역',
            lastChatMessageDate:'오후 21:39'
        },
        {title: '게시글 제목',
            lastChatMessage: '최근 보낸 카톡 내역',
            lastChatMessageDate:'오후 21:39'
        },
        {title: '게시글 제목',
            lastChatMessage: '최근 보낸 카톡 내역',
            lastChatMessageDate:'오후 21:39'
        }
    ]
    const ChatList = ({chatList}: ChatListProps)=>{
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        return(
            <div className="Chat">
                
                {chatList.map((data, index)=>(
                   <div>
                    <div id="profile"></div>
                    <div id="main_cont">
                        <div id="name">{data.title}</div>
                        <div id="ment">{data.lastChatMessage }</div>
                    </div>
                    <div id="ect">
                        <div id="time">{new Date(data.lastChatMessageDate).toLocaleDateString('ko-KR', options)}</div>
                       
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
            <ChatList chatList={dummy}/>
           
        </div>
    );
}
