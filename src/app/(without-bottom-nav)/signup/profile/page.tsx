'use client'
import '../signup.css';
import { useRouter } from 'next/navigation';

export default function SignupProfile() {
    const router = useRouter();
    return (
        <div className='signup'>
        <div id='back_btn'> {`<`} </div>
        <div id='profile_title'>프로필 생성</div>
        <button id='profileImgBtn'></button>
        <input id='nickname' placeholder='닉네임'></input>
        <div id='interest_title'>관심사를 선택하세요</div>
        <form id='interest'>
      
        
            <label htmlFor="web" className='checkbox_label'>
                <input type='checkBox' id='web' className='interCheck' value={'web'} ></input>
                웹 개발
            </label>

            <label htmlFor="app"  className='checkbox_label'>
                <input type='checkBox' id='app'className='interCheck'></input>
                앱 개발
            </label>
            <label htmlFor="game" className='checkbox_label'>
                <input type='checkBox' id='game'className='interCheck'></input>
                게임 개발
            </label>

            <label htmlFor="network" className='checkbox_label'>
                <input type='checkBox'id='network'className='interCheck'></input>
                네트워크 및 보안
            </label>

            <label htmlFor="ai" className='checkbox_label'>
                <input type='checkBox' id='ai'className='interCheck'></input>
                인공지능 및 머신러닝
            </label>

            <label htmlFor="DB" className='checkbox_label'>
                <input type='checkBox' id='DB'className='interCheck'></input>
                데이터베이스
            </label>

            <label htmlFor="hardware" className='checkbox_label'>
                <input type='checkBox' id='hardware'className='interCheck'></input>
                하드웨어 설계
            </label>

            <label htmlFor="RTOS" className='checkbox_label'>
                <input type='checkBox'id='RTOS'className='interCheck'></input>
                RTOS 기반 소프트웨어
            </label>

            <label htmlFor="signal_processing" className='checkbox_label'>
                <input type='checkBox' id='signal_processing'className='interCheck'></input>
                신호 처리 시스템
            </label>

            <label htmlFor="IoT" className='checkbox_label'>
                <input type='checkBox' id='IoT'className='interCheck'></input>
                IoT 시스템
            </label>

            <label htmlFor="startup" className='checkbox_label'>
                <input type='checkBox'id='startup'className='interCheck'></input>
                스타트업 및 창업
            </label>

        </form>
        <button id='submit' onClick={()=> router.push('/main')}>회원가입</button>
    </div>
    );
}
