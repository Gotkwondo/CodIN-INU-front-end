'use client'
import './signup.css';
import { PostMail } from '@/api/user/postMail';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { useContext, useState } from 'react';

export default function Signup() {
    const router = useRouter();
    const userContext = useContext(UserContext);

    if(!userContext){
        throw new Error('MyConsumer must be used within a MyProvider')
    }

    const { User, updateUser } = userContext;
    
    const [email, setEmail] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const hadleInputChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        setEmail(e.target.value);
    };

    const validateEmailDomain = (email: string): boolean => {
        const domain = email.split('@')[1];
        return domain === 'inu.ac.kr';  // @inu.ac.kr만 허용
      };

    const handleButtonClick = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!validateEmailDomain(email)) {
            setErrorMessage('이메일은 @inu.ac.kr 도메인만 사용할 수 있습니다.');
            alert('이메일은 @inu.ac.kr 도메인만 사용할 수 있습니다.')
            return;  // 이메일이 올바르지 않으면 이메일 전송을 하지 않음
          }

        if(email){
            console.log(`${email}로 인증코드 전송`);
            updateUser({email: email});
            console.log("context updated",email);
            alert("이메일을 전송하였습니다. 잠시만 기다려주세요.");
            localStorage.setItem("userEmail", email);
        }
        try{
            await PostMail(email);
            console.log("이메일 전송 완료");
            
            router.push('signup/auth');
        }catch(error){
            console.error("이메일 전송 실패", error);
            alert('이메일 전송을 실패하였습니다. 다시 시도해주세요.')
        }
            
        
    };

   
    return (
        <div className='signup'>
            <div id='back_btn' onClick={()=>router.push('/login')}> {`<`} </div>
            <div id='title'>이메일 인증하기</div>
            <form id='emailForm' onSubmit={handleButtonClick}>
            <input id='email' placeholder='이메일' onChange={hadleInputChange}></input>
            <button id='submit' type='submit'>인증번호 전송</button>
            </form>
        </div>
    );
}
