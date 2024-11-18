import './login.css';

export default function LoginPage() {
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
                <button id="findId">아이디 찾기 </button>
                <div id="divider"> | </div>
                <button id="findPW"> 비밀번호 찾기</button>
                <div id="divider"> | </div>
                <button id="signup">회원가입</button>
            </div>
            <div id="buttonCont">
                <button id='loginBtn'>로그인</button>
            </div>
        </div>
    );
}
