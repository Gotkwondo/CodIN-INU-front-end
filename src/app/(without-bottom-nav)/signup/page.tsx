import './signup.css';

export default function Signup() {
    return (
        <div className='signup'>
            <div id='back_btn'> {`<`} </div>
            <div id='title'>이메일 인증하기</div>
            <input id='email' placeholder='이메일'></input>
            <button id='submit'>인증번호 전송</button>
        </div>
    );
}
