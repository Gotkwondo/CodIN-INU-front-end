'use client';
import './vote.css';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import BottomNav from "@/components/BottomNav";
import { AuthContext } from '@/context/AuthContext';
import { GetChatRoomData } from '@/api/getChatRoomData';

export default function Chat() {
    const router = useRouter();
    const authContext = useContext(AuthContext);

    const { Auth } = authContext;
    const [voteList, setVoteList] = useState<any>([]); // 초기값은 any로 두었지만 나중에 타입을 정의할 수 있음
    const [accessToken, setToken] = useState<string>('');

    interface VoteData {
        title: string;
        content: string;
        pollOptions: string[];
        multipleChoice: boolean;
        pollEndTime: string;
        anonymous: boolean;
        postCategory: "POLL";
    }

    interface VoteListProps {
        voteList: VoteData[]; // VoteData 타입의 배열
    }

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        if (!accessToken) return;

        const getVoteData = async () => {
            try {
                console.log('토큰:', accessToken);
                const voteData = await GetChatRoomData(accessToken);
                console.log(voteData.data.dataList);
                setVoteList(voteData.data.dataList || []);
            } catch (error) {
                console.log("채팅방 정보를 불러오지 못했습니다.", error);
                setVoteList([]);
            }
        };

        getVoteData();
    }, [accessToken]);

    // VoteList 컴포넌트: voteList를 받아서 렌더링하는 컴포넌트
    const VoteList = ({ voteList }: VoteListProps) => {
        return (
            <div id="voteCont">
                {voteList.map((vote, index) => (
                    <div key={index}>
                        <h3>{vote.title}</h3>
                        <p>{vote.content}</p>
                        {/* 여기에서 투표 옵션들을 렌더링 */}
                        <ul>
                            {vote.pollOptions.map((option, i) => (
                                <li key={i}>{option}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="chat">
            <div id="topCont">
                <button id="back_btn">{`<`}</button>
                <div id="title">{`<익명 투표/>`}</div>
                <button id="searchBtn"></button>
            </div>
            <div id="tag">{`<ul>`}</div>
            {/* 올바르게 voteList 데이터를 전달 */}
            <VoteList voteList={voteList} />
            <div id="tag1">{`</ul>`}</div>
            <BottomNav />
        </div>
    );
}
