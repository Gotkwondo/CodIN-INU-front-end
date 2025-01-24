'use client';
import './vote.css';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import BottomNav from "@/components/Layout/BottomNav";
import { AuthContext } from '@/context/AuthContext';
import { GetVoteData } from '@/api/getVoteData';
import { PostVoting } from '@/api/postVoting';

export default function Vote() {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const chatBoxRef = useRef<HTMLDivElement | null >(null);
    const { Auth } = authContext;
    const [voteList, setVoteList] = useState<any>([]); // 초기값은 any로 두었지만 나중에 타입을 정의할 수 있음
    const [accessToken, setToken] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

    interface VoteData {
        title: string;
        content: string;
        likeCount: number;
        scrapCount: number;
        commentCount: number;
        hits: number;
        createdAt: Date;
        userInfo:{
            scrap:boolean;
            like:boolean;
        }
        poll:{
             pollOptions: string[];
             multipleChoice: boolean;
             pollEndTime: string;
             pollVotesCounts: number[];
             userVoteOptions:string[] | string ;
             totalParticipants: number;
             hasUserVoted: boolean;
             pollFinished: boolean;
            }
        anonymous: boolean;
        _id: string;
    }

    interface VoteListProps {
        voteList: VoteData[]; // VoteData 타입의 배열
    }
    const handleCheckboxChange = (voteId: string, index: number, multipleChoice: boolean) => {
        setSelectedOptions((prevSelected) => {
            const currentSelection = prevSelected[voteId] || [];

            if (multipleChoice) {
                // 여러 개 선택 가능
                if (currentSelection.includes(index)) {
                    // 이미 선택된 경우, 선택 해제
                    return { ...prevSelected, [voteId]: currentSelection.filter(item => item !== index) };
                } else {
                    // 선택되지 않은 경우, 추가
                    return { ...prevSelected, [voteId]: [...currentSelection, index] };
                }
            } else {
                // 단일 선택만 가능
                return { ...prevSelected, [voteId]: [index] }; // 하나의 옵션만 선택
            }
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        if (!accessToken) return;

        const getVoteData = async (page: number) => {

            if (!hasMore || isLoading) return;

            setIsLoading(true);
            try {
                console.log('토큰:', accessToken);
                const voteData = await GetVoteData(accessToken, page);
                const newVoteData = voteData.data.contents || [];
                console.log(voteData.data);
                if (newVoteData.length === 0) {
                    setHasMore(false); // 더 이상 불러올 데이터가 없음
                } else {
                   setVoteList((prev) => [...newVoteData, ...prev]); // 이전 메시지 추가
                }
                setIsLoading(false)
            } catch (error) {
                console.log("투표 정보를 불러오지 못했습니다.", error);
                setVoteList([]);
            }
        };

        getVoteData(page);
    }, [accessToken]);


    const handleScroll = () => {
        if (!chatBoxRef.current) return;
        const { scrollTop } = chatBoxRef.current;
        if (scrollTop === 0 && hasMore && !isLoading) {
            setPage((prev) => prev + 1); // 다음 페이지 요청
        }
    };

    const calculateDaysLeft = (endDate: string) => {
        const end = new Date(endDate);  // 투표 종료 시간을 Date 객체로 변환
        const now = new Date();  // 현재 시간
        const timeDiff = end.getTime() - now.getTime();  // ms 단위 차이 계산

        // 시간 차이를 일 단위로 변환
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));  // 하루는 1000 * 3600 * 24 ms

        return daysLeft;
    };

    const votingHandler = async (e: React.MouseEvent<HTMLButtonElement>, voteId: string) => {
        e.preventDefault();
        try {
            const response = await PostVoting(accessToken, voteId, selectedOptions[voteId] || []);
            console.log('결과:', response);
            window.location.reload();
        } catch (error) {
            console.error("투표 실패", error);
            const message = error.response.data.message;
            alert(message);
        }
    };

    // VoteList 컴포넌트: voteList를 받아서 렌더링하는 컴포넌트
    const VoteList = ({ voteList }: VoteListProps) => {
        return (
            <div id="voteCont">
                {voteList.map((vote) => (
                    <div key={vote._id} id='voteIndex'>
                        <h3 id='voteTitle'  onClick={()=> router.push(`/vote/${vote._id}`)}>{vote.title}</h3>
                        <p id='voteContent'>{vote.content}</p>
                        <div id='voteContainer'>
                        {calculateDaysLeft(vote.poll.pollEndTime) > 0 && vote.poll.hasUserVoted === false ?  (
                            <>
                        <ul id='ulCont'>
                            {vote.poll.pollOptions.map((option, i) => (
                                <li id='pollCont'  key={i}>
                                    <input
                                        type='checkBox'
                                        key={i}
                                        className='voteOption'
                                        id={`pollOptionCheckBox-${vote._id}-${i}`}
                                        onChange={() => handleCheckboxChange(vote._id, i, vote.poll.multipleChoice)}
                                        checked={selectedOptions[vote._id]?.includes(i) || false}
                                        disabled={vote.poll.pollFinished}
                                        >

                                        </input>
                                    <p id='optionText1'>{option}</p>
                                </li>

                            ))}
                        </ul>
                        <button id='voteBtn'  disabled={selectedOptions[vote._id]?.length === 0} onClick={(e) => votingHandler(e, vote._id)}>투표하기</button>
                        </>
                        ) : (
                           <div id='conT'>
                              {vote.poll.pollOptions.map((option, i) => (
                                <li  key={i} id='pollOpCont'>
                                <div id='cont1'>
                                    <p id='optionText'>{option}</p>
                                    <div id='optionCount'>{vote.poll.pollVotesCounts[i]}명</div>
                                    </div>

                                    <div id='statusbar'></div>
                                    <div id="pollOptionBar"style={{ width: `${(vote.poll.pollVotesCounts[i] / vote.poll.totalParticipants) * 100}%`, }}></div>
                                    <div id='pollOptionCount'></div>
                                </li>

                            ))}
                           </div>
                        )}
                        <div id='ect'>
                            <div id='count'>{vote.poll.totalParticipants}명 참여</div>
                            {vote.poll.multipleChoice && <div id='ismulti'> • 복수투표</div>}
                        </div>
                        </div>

                        <div id='pollEndTime'>
                        {calculateDaysLeft(vote.poll.pollEndTime) > 0 ?  (
                            <>
                                {calculateDaysLeft(vote.poll.pollEndTime)}일 후 종료
                            </>
                        ) : (
                            '종료됨'
                        )}
                        </div>
                        <div id='viewContainer'>
                            <div id='view'>
                                <div id='viewIcon'></div>
                                <div id='viewCount'>{vote.hits}</div>
                            </div>
                            <div id='like'>
                                <div id='likeIcon'></div>
                                <div id='likeCount'>{vote.likeCount}</div>
                            </div>
                            <div id='comment'>
                                <div id='commentIcon'></div>
                                <div id='commentCount'>{vote.commentCount}</div>
                            </div>


                        </div>
                        <div id='divider'></div>

                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="vote">
            <div id="topCont">
                <button id="back_btn"  onClick={()=> router.push('/main')}>{`<`}</button>
                <div id="title">{`<익명 투표/>`}</div>
                <button id="searchBtn"></button>
            </div>
            <div id="tag">{`<ul>`}</div>

            <div id='VoteListCont' ref={chatBoxRef} onScroll={handleScroll}>
                {isLoading && <div className="loading">Loading...</div>}
                <VoteList voteList={voteList} />
            </div>
            <div id="tag1">{`</ul>`}</div>
            <button id="writeBtn"  onClick={()=> router.push('/vote/write')}></button>
            <BottomNav activeIndex={0}/>
        </div>
    );
}
