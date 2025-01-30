'use client';
import '../vote.css';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';

import { PostVoting } from '@/api/vote/postVoting';
import { GetVoteDetail } from '@/api/vote/getVoteDetail';
import { useParams } from 'next/navigation';
import { PostLike } from '@/api/like/postLike';
import Header from '@/components/Layout/header/Header';
import CommentSection from '@/components/board/CommentSection';

export default function VoteDetail() {
    const router = useRouter();
    const [accessToken, setToken] = useState<string>('');
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number[] }>({});
    const [vote, setVote] = useState<vote | null>(null);
    const { voteId } = useParams();
    const [isPostLiked, setIsPostLiked] = useState<{ [key: string]: boolean }>({}); // 수정: 객체로 변경    const [isCommentLiked, setIsCommentLiked] = useState<{ [key: string]: boolean }>({});
    const [likeCount, setLikeCount] = useState<number>(0);
   

   

    interface vote {

        title: string;
        content: string;
        likeCount: number;
        scrapCount: number;
        commentCount: number;
        hits: number;
        createdAt: Date;
        userInfo: {
            scrap: boolean;
            like: boolean;
        };
        poll: {
            pollOptions: string[];
            multipleChoice: boolean;
            pollEndTime: string;
            pollVotesCounts: number[];
            userVoteOptions: string[] | string;
            totalParticipants: number;
            hasUserVoted: boolean;
            pollFinished: boolean;
        };
        anonymous: boolean;
        _id: string;
    }

    useEffect(() => {
        if (!voteId) {
            console.error("voteId가 URL에 존재하지 않습니다");
        }
    }, [voteId]);


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
        if (!accessToken || !voteId) return;

        const getVoteData = async () => {
            try {
                const voteData = await GetVoteDetail(accessToken, voteId);

                const voteInfo = voteData.data;
                setLikeCount(voteInfo.likeCount);
                setVote(voteInfo);

               

                const initialPostLike = {
                    [voteInfo._id]: voteInfo.userInfo.like, // 게시물에 대한 좋아요 상태 설정
                };
                setIsPostLiked(initialPostLike); // 게시물 좋아요 상태 초기화

    
            } catch (error) {
                console.log("투표 정보를 불러오지 못했습니다.", error);
            }
        };

        getVoteData();
    }, [accessToken, voteId]);


    //게시글 좋아요 핸들러
    const handleLike = async (e: React.MouseEvent<HTMLDivElement>, likeType: string, id: string) => {
        e.preventDefault();

        if (likeType === 'POST') {
            // 게시글 좋아요 상태 반전
            const newLikeStatus = !isPostLiked[id]; // 해당 게시물의 좋아요 상태를 반전
            try {
                await PostLike( likeType, id);
                setIsPostLiked((prevState) => ({ ...prevState, [id]: newLikeStatus })); // 상태 업데이트

                setLikeCount((prevCount) => newLikeStatus ? prevCount + 1 : prevCount - 1);
            } catch (error) {
                console.error("좋아요 처리 실패", error);
            }
        
        }
    };

    // 종료까지 남은 시간 계산 함수
    const calculateDaysLeft = (endDate: string) => {
        const end = new Date(endDate);  // 투표 종료 시간을 Date 객체로 변환
        const now = new Date();  // 현재 시간
        const timeDiff = end.getTime() - now.getTime();  // ms 단위 차이 계산

        // 시간 차이를 일 단위로 변환
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));  // 하루는 1000 * 3600 * 24 ms

        return daysLeft;
    };

    //투표 실행 핸들러
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

    //시간 포맷 함수
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // 24시간 포맷
        };
        return new Intl.DateTimeFormat('ko-KR', options).format(date);
    };


    return (
        <div className="vote">
            <Header>
                <Header.BackButton/>
                <Header.Title>{`<게시글/>`}</Header.Title>
                <Header.Menu>
                    <Header.MenuItem onClick={() => console.log("채팅하기 클릭")}>
                        채팅하기
                    </Header.MenuItem>

                    <Header.MenuItem onClick={() => console.log("신고하기 클릭")}>
                        신고하기
                    </Header.MenuItem>

                    <Header.MenuItem onClick={() => console.log("차단하기 클릭")}>
                        차단하기
                    </Header.MenuItem>
                </Header.Menu>
            </Header>

            {/* 프로필 */}
            <div id='profileCont'>
                <div id='profileImg'></div>
                <div id='ectCont'>
                    <div id='userName'>익명</div>
                    <div id='createdAt'>{vote ? formatDate(new Date(vote.createdAt)) : ''}</div>
                </div>
            </div>

            {/* 스크롤 되는 부분 */}
            <div id="voteCont"> 
                {/* 투표 컨테이너 */}
                {vote && (
                    <div id='voteIndex'>

                        <h3 id='voteTitle'>{vote.title}</h3>

                        <p id='voteContent'>{vote.content}</p>

                        <div id='voteContainer'>
                            {calculateDaysLeft(vote.poll.pollEndTime) > 0 && !vote.poll.hasUserVoted ? ( //투표 기간이 종료되지 않았거나 유저가 아직 투표를 하지 않았을때
                                <>
                                    <ul id='ulCont'>
                                        {vote.poll.pollOptions.map((option, i) => (
                                            <li key={i} id='pollCont'>
                                                <input
                                                    type='checkbox'
                                                    className='voteOption'
                                                    id={`pollOptionCheckBox-${vote._id}-${i}`}
                                                    onChange={() => handleCheckboxChange(vote._id, i, vote.poll.multipleChoice)}
                                                    checked={selectedOptions[vote._id]?.includes(i)}
                                                    disabled={vote.poll.pollFinished}
                                                />
                                                <p id='optionText1'>{option}</p>
                                            </li>
                                        ))}
                                    </ul>
                                    <button id='voteBtn' disabled={selectedOptions[vote._id]?.length === 0} onClick={(e) => votingHandler(e, vote._id)}>투표하기</button>
                                </>
                            ) 
                            
                            : ( // 투표 기간이 만료되었거나 유저가 투표를 완료하였을 때
                                <div id='conT'>
                                    {vote.poll.pollOptions.map((option, i) => (
                                        <li key={i} id='pollOpCont'>
                                            <div id='cont1'>
                                                <p id='optionText'>{option}</p>
                                                <div id='optionCount'>{vote.poll.pollVotesCounts[i]}명</div>
                                            </div>
                                            <div id='statusbar'></div>
                                            <div id="pollOptionBar" style={{ width: `${(vote.poll.pollVotesCounts[i] / vote.poll.totalParticipants) * 100}%` }}></div>
                                        </li>
                                    ))}
                                </div>
                            )}

                             {/* 기타 투표 정보 */}
                            <div id='ect'>
                                <div id='count'>{vote.poll.totalParticipants}명 참여</div>
                                {vote.poll.multipleChoice && <div id='ismulti'> • 복수투표</div>}
                            </div>
                        </div>


                            {/* n일 후 종료 */}
                        <div id='pollEndTime'>
                            {calculateDaysLeft(vote.poll.pollEndTime) > 0 ? (
                                <>
                                    {calculateDaysLeft(vote.poll.pollEndTime)}일 후 종료
                                </>
                            ) : (
                                '종료됨'
                            )}
                        </div>

                        {/* 뷰, 좋아요, 댓글 수*/}
                        <div id='viewContainer'>
                            <div id='view'>
                                <div id='viewIcon'></div>
                                <div id='viewCount'>{vote.hits}</div>
                            </div>
                            <div id='like'>
                            <div id='likeIcon' className={isPostLiked[vote._id] ? 'liked' : ''} onClick={(e) => handleLike(e, 'POST', vote._id)} ></div>
                                <div id='likeCount'>{likeCount}</div>
                            </div>
                            <div id='comment'>
                                <div id='commentIcon'></div>
                                <div id='commentCount'>{vote.commentCount}</div>
                            </div>
                        </div>


                        <div id='divider'></div>

                    </div>
                )}

                <CommentSection postId={voteId.toString()}/>
            </div>
     
        </div>
    );
}
