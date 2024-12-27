'use client'
import './findPW.css';
import { PostMailPW } from '@/api/postMailPW';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';

export default function FindPW() {
    const router = useRouter();
    
    const [email, setEmail] = useState<string>("");
    const [isMailSent, setMailSent] = useState<boolean>(false);
    const hadleInputChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        setEmail(e.target.value);
    };

    const handleButtonClick = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if(email){
            console.log(`${email}로 인증코드 전송`);
            console.log("context updated",email);

            localStorage.setItem("userEmail", email);
        }
        try{
            await PostMailPW(email);
            console.log("이메일 전송 완료");
            setMailSent(true);
            router.push('signup/auth');
        }catch(error){
            console.error("이메일 전송 실패", error);
            alert('이메일 전송을 실패하였습니다. 다시 시도해주세요.')
        }
            
        
    };

   
    return (
        <div className='findPW'>
            <div id='back_btn' onClick={()=>router.push('/login')}> {`<`} </div>
            <div id='title'>비밀번호 찾기</div>
            <form id='emailForm' onSubmit={handleButtonClick}>
            <input id='email' placeholder='이메일' onChange={hadleInputChange}></input>
            <button id='submit' type='submit'>인증번호 전송</button>
            </form>
            {isMailSent && (
            <div>
                <div id='codeCont'>
                <input className="codeInput" placeholder='인증번호'></input>
                <p id='timer'></p>
                </div>

            </div>
          )}
          <button id='nextBtn'>인증하기</button>
        </div>
    );
}
