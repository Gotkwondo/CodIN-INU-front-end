import '../signup.css';

export default function SignupInfo() {
    return (
        <div className='signup'>
        <div id='back_btn'> {`<`} </div>
        <div id='title'>학적 정보 등록</div>
        <input id='email' placeholder='학번'></input>
        <input id='password' placeholder='학과'></input>
        <div id='imageText'>학적 정보 이미지 업로드</div>
        <button id='imgFileBtn'>파일첨부</button>
        <div id='info'>학적 정보 업로드에 대한 안내 문구</div>
        <div id='accept'>
        <input type="checkbox" id="acceptBtn"></input>
            <div id='acceptMent'>동의합니다</div>
        </div>
        <div id='checkBoxCont'>
            이용 약간 및 개인정보 처리방침 동의 체크박스
        </div>
        <button id='submit'>다음</button>
    </div>
    );
}
