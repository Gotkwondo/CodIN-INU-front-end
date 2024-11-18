import '../signup.css';

export default function SignupPw() {
    return (
        <div className='signup'>
        <div id='back_btn'> {`<`} </div>
        <div id='title'>비밀번호 생성</div>
        <input id='email' placeholder='비밀번호'></input>
        <input id='password' placeholder='비밀번호 재입력'></input>
        <button id='submit'>다음</button>
    </div>
    );
}
