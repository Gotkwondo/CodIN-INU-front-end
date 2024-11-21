'use client'
import './signup.css';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const router = useRouter();

    return (
        <div className='signup'>
            <div id='back_btn'> {`<`} </div>
            <div id='title'>이메일 인증하기</div>
            <input id='email' placeholder='이메일'></input>
            <button id='submit' onClick={()=> router.push('signup/auth')}>인증번호 전송</button>
        </div>
    );
}
