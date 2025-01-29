'use client'
import './findPW.css';
import { PostMailPW } from '@/api/user/postMailPW';
import { PostPwCheck } from '@/api/user/postPwCheck';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';

export default function FindPW() {
    const router = useRouter();
    
    const [email, setEmail] = useState<string>("");
    const [isMailSent, setMailSent] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(600);
    const [isTimerActive, setTimerActive] = useState<boolean>(false);
    //const [code, setCode] = useState<string>('');
    const hadleInputChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        setEmail(e.target.value);
    };

    // const handleCodeChange = (e:React.ChangeEvent<HTMLInputElement>):void =>{
    //     setCode(e.target.value);
    // }

    // const handleCodeSubmit = async (e: React.MouseEvent<HTMLButtonElement>):Promise<void> =>{
    //     e.preventDefault();
        
    //         console.log('코드 전송:', code);
    //     try{
    //         await PostPwCheck(email, code);
    //         console.log('코드 전송 완료');
    //         alert('인증 성공하였습니다');

    //     }catch(error){
    //         console.error("코드 전송 실패", error);
    //         alert("코드 인증을 실패하였습니다. 다시 시도해주세요.");
    //     }
    // };
    const handleButtonClick = async (e: React.MouseEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if(email){
            console.log(`${email}로 인증코드 전송`);
        }
        try{
            await PostMailPW(email);
            console.log("이메일 전송 완료");
            setMailSent(true);
            setTimer(600);
            setTimerActive(true);
            alert("이메일을 전송하였습니다. 이메일을 확인 해 주세요")
            
        }catch(error){
            console.error("이메일 전송 실패", error);
            alert('이메일 전송을 실패하였습니다. 다시 시도해주세요.')
        }
            
    };

    useEffect(() => {
        if (isTimerActive && timer > 0){
            const countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer -1);
            }, 1000);
            return () => clearInterval(countdown);
        }else if (timer === 0 ){
            setTimerActive(false);
        }
    }, [isTimerActive, timer]);

    // const formatTime = (seconds: number) => {
    //     const minutes = Math.floor(seconds / 60);
    //     const secs = seconds % 60 ;
    //     return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    // }
   
    return (
        <div className='findPW'>
            <div id='back_btn' onClick={()=>router.push('/login')}> {`<`} </div>
            <div id='title'>비밀번호 찾기</div>
            <form id='emailForm' onSubmit={handleButtonClick}>
            <input id='email' placeholder='이메일' onChange={hadleInputChange}></input>
            {/* <button id='submit' type='submit'>인증번호 전송</button> */}
            <button id='nextBtn' type='submit'>인증하기</button>
            </form>
            {/*
            {isMailSent && (
            <div id='cont1'>
                <div id='codeCont'>
                <input 
                    className="codeInput" 
                    placeholder='인증번호'
                    disabled = {!isTimerActive}
                    onChange={handleCodeChange}
                    ></input>
                <p id='timer'>{timer > 0 ? formatTime(timer) : '인증시간 초과'}</p>
                </div>

            </div>
          )} */}
         
        </div>
    );
}
