'use client';
import '../signup.css';
import { useRouter } from 'next/navigation';

export default function SignupPw() {
    const router = useRouter();
    return (
        <div className='signup'>
        <div id='back_btn'> {`<`} </div>
        <div id='title'>비밀번호 생성</div>
        <input id='email' placeholder='비밀번호'></input>
        <input id='password' placeholder='비밀번호 재입력'></input>
        <button id='submit' onClick={()=>router.push('/signup/info')}>다음</button>
    </div>
    );
}
