'use client';
import '../signup.css';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { useContext, useState } from 'react';

export default function SignupInfo() {
    const router = useRouter();
    const formData= new FormData();
    const [ studentId, setId] = useState<string>("");
    const [ department, setDepartment] = useState<string>("");
    const [profileImg, setProfileImg ] = useState<string>("");
    const handleDpartmentChange = (e:React.ChangeEvent<HTMLSelectElement>):void => {
        setDepartment(e.target.value);
        console.log('학과 변경됨',e.target.value);
    }
    const handleIdChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        setId(e.target.value);
    }
    // const handleSubmit = (e:React.MouseEvent<HTMLButtonElement>):Promise<void> => {

    // }

    // const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
    //     const {files}:HTMLImageElement = e.target;
    //     const uploadFile = files[0];

    // }
    return (
        <div className='signup'>
        <div id='back_btn'> {`<`} </div>
        <div id='title'>학적 정보 등록</div>
        <input id='email' placeholder='학번'></input>
        <select id='password' defaultValue='컴퓨터공학부' onChange={handleDpartmentChange}>
            <option value={'컴퓨터공학부'}>컴퓨터공학부</option>
            <option value={'정보통신공학과'}>정보통신공학과</option>
            <option value={'임베디드시스템공학과'}>임베디드시스템공학과</option>
        </select>
        <div id='imageText'>학적 정보 이미지 업로드</div>
        <input type='file' accept = 'image/*' id='imgFileBtn' >파일첨부</input>
        <div id='info'>학적 정보 업로드에 대한 안내 문구</div>
        <div id='accept'>
        <input type="checkbox" id="acceptBtn"></input>
            <div id='acceptMent'>동의합니다</div>
        </div>
        <div id='checkBoxCont'>
            이용 약간 및 개인정보 처리방침 동의 체크박스
        </div>
        <button id='submit' onClick={()=>router.push('/signup/profile')}>다음</button>
    </div>
    );
}
