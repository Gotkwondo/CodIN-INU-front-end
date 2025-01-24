
'use client';
import '../../vote/vote.css';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';  // 날짜 선택을 위한 라이브러리
import "react-datepicker/dist/react-datepicker.css";  // 스타일시트 임포트
import { ko } from 'date-fns/locale';  // 한글 로케일 임포트
import React from 'react';
import { newDate } from 'react-datepicker/dist/date_utils';
import TimePicker from 'react-time-picker';
import { PostVote } from '../../../../api/vote/postVote';

export default function Vote() {
    const router = useRouter();
    const [accessToken, setToken] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false);
    const [anonymity, setAnonymity] = useState<boolean>(false);
    const [options, setOptions] = useState<string[]>(['', '']);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());  // 날짜 상태
    const [selectedTime, setSelectedTime] = useState<string>('00:00');
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    
    const handleDateChange = (date: Date): void => {
         setSelectedDate(date);
    }
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setToken(token);
        }
    }, []);
    const convertTo24Hour = (time12h: string) => {
        const [time, modifier] = time12h.split(' ');
        if (!time || !modifier) return time12h; // 예외 처리
        let [hours, minutes] = time.split(':');
        
        // 오전/오후에 따른 시간 처리
        if (modifier === '오후' && +hours < 12) hours = `${+hours + 12}`;  // 오후 12시 이후에 12를 더해줌
        if (modifier === '오전' && +hours === 12) hours = '00';  // 오전 12시는 00으로 설정
        
        // 변환된 24시간 형식 시간 반환
        return `${hours}:${minutes}`;
    };
    

    
  const handletitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
    
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setContent(e.target.value);
    
  };



    const handleTimeChange = (time: string) => {
        if (time) {
           
            setSelectedTime(time);  // 변환된 24시간 형식 시간 상태 업데이트
            console.log('시간변경', time);
        } 
    };

    const handleChecked = (e:React.MouseEvent<HTMLInputElement>):void =>{
        if (checked){setChecked(false);}
        else {setChecked(true);}
     }

     const handleAnonymity = (e:React.MouseEvent<HTMLInputElement>):void =>{
        if (anonymity){setAnonymity(false);}
        else {setAnonymity(true);}
     }

     const addOption = (): void => {
        if (options.length < 5) {
            setOptions([...options, '']);  // 새로운 빈 항목 추가
        } else {
            alert("옵션은 최대 3개까지만 추가할 수 있습니다.");
        }
    }
     
    const handleOptionChange = (index: number, value: string): void => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);  // 해당 인덱스의 옵션값 업데이트
    }

  
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
            e.preventDefault();
            console.log('버튼 눌림');
            // selectedTime에서 시, 분을 추출 (예: "10:52" -> 10, 52)
            const [hours, minutes] = selectedTime.split(':');
            
            // selectedDate에서 년, 월, 일 정보 가져오기
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;  // getMonth()는 0부터 시작하므로 1을 더해줘야 합니다.
            const day = selectedDate.getDate();
            
            // 두 값을 yyyy/MM/dd HH:mm 형식으로 결합
            const formattedDate = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${hours}:${minutes}`;
            
             try {
                   
                    const response = await PostVote(accessToken, title, content, options, checked, formattedDate, anonymity);
                    console.log('결과:', response);
                    router.push('/vote');
                  } catch (error) {
                    console.error("투표 작성 실패", error);
                    const message = error.response.data.message;
                    alert(message);
                  }
                }

            

     return (
            <div className="vote">
                <div id="topCont">
                    <button id="back_btn"  onClick={()=> router.push('/vote')}>{`<`}</button>
                    <div id="title">{`<글쓰기/>`}</div>
                    <button id="searchBtn" style={{backgroundImage:'none'}}></button>
  
                </div>
                <input id="write_content" placeholder='내용을 입력하세요' onChange={handleContentChange}></input>
                <div id='voteCont_write'>
                    <input id="write_title" placeholder='투표 제목' onChange={handletitleChange}></input>
                   {options.map((option, index) => (
                    <input
                        key={index}
                        className="option"
                        value={option}
                        placeholder='항목 입력'
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                ))}
                    <button id='addOption'  onClick={addOption}>+ 항목 추가</button>
                    <div id='multipleCont'>
                    <input type="checkbox" id="multipleBtn" onClick={handleChecked}></input>
                        <div id='multipleMent'>복수선택</div>
                    </div>
                    
                </div>
                <div id='endTimeCont'>
                    <div id='endTimeTitle'>투표 종료시간 설정</div>
                    <div id='dateCont'> 
                        <div id='clockIcon'></div>
                        <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd (E)"
                        id="write_date" 
                        locale={ko}    
                         />
                         <TimePicker
                          id='write_time'
                          value={selectedTime}
                          format="hh:mm a" 
                          onChange={handleTimeChange}
                          clearIcon
                          clockIcon
                          locale="ko-KR"
                          hourAriaLabel='false'
                          
                         />
                </div>
                </div>

              {/*}  <div id='anonymityCont'>
                    <input type="checkbox" id="anonymityBtn" onClick={handleAnonymity}></input>
                        <div id='anonymityMent'>익명</div>
                </div>*/}

                <button id='submit' onClick={handleSubmit}>작성 완료</button>
                
            
            </div>
        );

}