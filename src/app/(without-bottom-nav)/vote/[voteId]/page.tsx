'use client';
import '../vote.css';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import BottomNav from "@/components/BottomNav";
import { AuthContext } from '@/context/AuthContext';
import { PostVoting } from '@/api/postVoting';
import { GetVoteDetail } from '@/api/getVoteDetail';
import { useParams } from 'next/navigation';
import { GetComments } from '@/api/getComments';
import { PostComments } from '@/api/postComment';

export default function VoteDetail() {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const [accessToken, setToken] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number[] }>({});
    const [vote, setVote] = useState<vote | null>(null);
    const { voteId } = useParams();
    const [checked, setChecked] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [commentList, setCommentList] = useState<any>([]);
    interface comment{
        anonymous: boolean,
        content : string,
        createdAt : string,
        deleted : boolean,
        likeCount : number,
        nickname : string,
        replies :  string[],
        userId : string,
        userImageUrl : string,
        userInfo : {like: boolean},
        _id : string
    }

    interface CommentListProps{
        commentList: comment[];
    }

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

      const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setComment(e.target.value);
        
      };
    

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
                console.log('토큰:', accessToken);
                const voteData = await GetVoteDetail(accessToken, voteId);
                const commentData = await GetComments(accessToken, voteId);
                console.log(voteData.data);
                console.log(commentData.dataList);
                const newCommentData = commentData.dataList || [];
                setCommentList((prev)=>[...newCommentData, ...prev]);
                setVote(voteData.data);
            } catch (error) {
                console.log("투표 정보를 불러오지 못했습니다.", error);
            }
        };

        getVoteData();
    }, [accessToken, voteId]);

    const CommentList = ({commentList}: CommentListProps) =>{
        return(
            <div id='commentCont'>
               {commentList.map((comment, i) => (
                <div key={i} id='commentIndex'>
                    <div id='conT3'>
                    <div id='Com_profileImg'></div>
                    <div id='ectCont'>
                        <div id='firstCont'>
                        <div id='commentNick'>{comment.anonymous ? '익명' : comment.nickname}</div>                        <div id='createdBefore'> • {comment.createdAt}</div>
                        </div>

                        <div id='comContent'>{comment.content}</div>
                    </div>
                    </div>
                    <div id='heartCont'>
                    <div id='likeIcon'></div>
                    <div id='likeCount'>{comment.likeCount}

                    </div>
                    </div>
                </div>
               ))}
            </div>
        )
    }
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

     const handleChecked = (e:React.MouseEvent<HTMLInputElement>):void =>{
            if (checked){setChecked(false);}
            else {setChecked(true);}
         }

    const handleCommentSend = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
                e.preventDefault();

                 try {
                                   
                                    const response = await PostComments(accessToken, voteId, comment, checked);
                                    console.log('결과:', response);
                                    window.location.reload();  

                                  } catch (error) {
                                    console.error("댓글 작성 실패", error);
                                    const message = error.response.data.message;
                                    alert(message);
                                  }
            }
    return (
        <div className="vote">
            <div id="topCont">
                <button id="back_btn" onClick={() => router.push('/main')}>{`<`}</button>
                <div id="title">{`<게시글/>`}</div>
                <button id="searchBtn"></button> 
            </div>

            <div id='profileCont'>
                <div id='profileImg'></div>
                <div id='ectCont'>
                    <div id='userName'>익명</div>
                    <div id='createdAt'>{vote ? formatDate(new Date(vote.createdAt)) : ''}</div>
                </div>
                
            </div>
            
            <div id="voteCont">
                {vote && (
                    <div id='voteIndex'>
                        <h3 id='voteTitle'>{vote.title}</h3>
                        <p id='voteContent'>{vote.content}</p>
                        <div id='voteContainer'>
                            {calculateDaysLeft(vote.poll.pollEndTime) > 0 && !vote.poll.hasUserVoted ? (
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
                            ) : (
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
                            <div id='ect'>
                                <div id='count'>{vote.poll.totalParticipants}명 참여</div>
                                {vote.poll.multipleChoice && <div id='ismulti'> • 복수투표</div>}
                            </div>
                        </div>

                        <div id='pollEndTime'>
                            {calculateDaysLeft(vote.poll.pollEndTime) > 0 ? (
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
                )}
            </div>
                <CommentList commentList={commentList}/>
            <div id='divider_B'></div>
            <div id='inputCont'>
            <div id='anounCont'>
                    <input type="checkbox" id="anounBtn" onClick={handleChecked}></input>
                        <div id='anounMent'>익명</div>
                    </div>
                <input id='commentInput' placeholder='댓글을 입력하세요' onChange={handleCommentChange}></input>
                <button id='commentSend' onClick={handleCommentSend}></button>
            </div>
        </div>
    );
}