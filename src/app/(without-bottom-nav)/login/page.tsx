'use client';
import './login.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    return (
        <div className="Login">
            <div id="logo"></div>
            <div id="inputBox">
                <input id="email" placeholder='이메일'></input>
                <input id="password" placeholder='비밀번호'></input>
                <div id='remainCont'>
                    <input type="checkbox" id="remain"></input>
                    <label id="remainText">로그인 유지</label>
                </div>
          
                
            </div>
            <div id="else">
                <button id="findId" >아이디 찾기 </button>
                <div id="divider"> | </div>
                <button id="findPW"> 비밀번호 찾기</button>
                <div id="divider"> | </div>
                <button id="signup" onClick={()=> router.push('/signup')}>회원가입</button>
            </div>
            <div id="buttonCont">
                <button id='loginBtn'>로그인</button>
            </div>
        </div>
    );
}
