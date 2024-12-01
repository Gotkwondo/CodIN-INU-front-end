'use client';
import '../signup.css';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { useContext, useState } from 'react';

export default function SignupInfo() {
    const router = useRouter();
    const formData= new FormData();
    const [ studentId, setId] = useState<string>("");
    const [ department, setDepartment] = useState<string>("컴퓨터공학부");
    const [profileImg, setProfileImg ] = useState<string>("");
    const [checked, setChecked] = useState<boolean>(false);
    const userContext = useContext(UserContext);
    if(!userContext){
        throw new Error('MyConsumer must be used within a MyProvider')
    }

    const {User, updateUser} = userContext;

    const handleDpartmentChange = (e:React.ChangeEvent<HTMLSelectElement>):void => {
        setDepartment(e.target.value);
        console.log('학과 변경됨',e.target.value);
    }
    const handleIdChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
        setId(e.target.value);

    }
     const handleSubmit = async(e:React.MouseEvent<HTMLButtonElement>):Promise<void> => {
        e.preventDefault();

        
     }
     const handleChecked = (e:React.MouseEvent<HTMLInputElement>):void =>{
        if (checked){setChecked(false);}
        else {setChecked(true);}
     }
     const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
         const files = e.target.files;
         if(files && files[0]){
            const uploadFile = files[0];
            const reader = new FileReader();
            reader.readAsDataURL(uploadFile);
            reader.onloadend = () => {
                if (reader.result){
                     setProfileImg(reader.result as string);
                     console.log(reader.result as string);
                     console.log(profileImg);
                }
            }
         }

     }

     const handlenext = (e:React.MouseEvent<HTMLButtonElement>):void => {
        e.preventDefault();
        if(studentId && department){
            updateUser(
                {studentId: studentId,
                department: department});
            console.log('user updated', User);
            router.push('/signup/profile');
        } else { alert('모든 정보를 입력해주세요!')}
     }
    return (
        <div className='signup'>
        <div id='back_btn'> {`<`} </div>
        <div id='title'>학적 정보 등록</div>
        <input id='email' placeholder='학번' onChange={handleIdChange}/>
        <select id='password' defaultValue='컴퓨터공학부' onChange={handleDpartmentChange}>
            <option value={'컴퓨터공학부'}>컴퓨터공학부</option>
            <option value={'정보통신공학과'}>정보통신공학과</option>
            <option value={'임베디드시스템공학과'}>임베디드시스템공학과</option>
        </select>
        {/*<div id='imageText'>학적 정보 이미지 업로드</div>
        <input type='file' accept = 'image/*' id='imgFileBtn' onChange={handleImageChange}/>
        <div id='info'>학적 정보 업로드에 대한 안내 문구</div>*/}
        <div id='accept'>
        <input type="checkbox" id="acceptBtn" onClick={handleChecked}></input>
            <div id='acceptMent'>동의합니다</div>
        </div>
        <div id='checkBoxCont'>
            이용 약간 및 개인정보 처리방침 동의 체크박스
        </div>
        <button id='submit' onClick={handlenext} disabled={!checked}>다음</button>
    </div>
    );
}
