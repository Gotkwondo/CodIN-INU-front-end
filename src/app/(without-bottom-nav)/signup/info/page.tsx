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
            <option value={'COMPUTER_SCI'}>컴퓨터공학부</option>
            <option value={'INFO_COMM'}>정보통신공학과</option>
            <option value={'EMBEDDED'}>임베디드시스템공학과</option>
            <option value={'STAFF'}>교직원</option>
        </select>
        {/*<div id='imageText'>학적 정보 이미지 업로드</div>
        <input type='file' accept = 'image/*' id='imgFileBtn' onChange={handleImageChange}/>
        <div id='info'>학적 정보 업로드에 대한 안내 문구</div>*/}
        <div id='accept'>
        <input type="checkbox" id="acceptBtn" onClick={handleChecked}></input>
            <div id='acceptMent'>동의합니다</div>
        </div>
        <div id='checkBoxCont'>
                    제1조 (목적)<br></br>
            ① 본 약관은 CodIN(이하 '코딘')의 이용과 관련하여, 서비스 운영자가 이용자에게 제공하는 서비스의 이용 조건 및 절차, 이용자의 권리와 의무, 기타 필요한 사항을 규정함을 목적으로 합니다.
             <br></br>
             <br></br>
            제2조 (서비스 이용 대상)<br></br>
            ① 본 서비스는 정보기술대학 학생을 대상으로 하며, 가입 시 학교 웹메일을 통해 인증을 완료해야 합니다.
            <br></br>
            ② 인증되지 않은 사용자는 서비스 이용이 제한될 수 있습니다.
            <br></br> <br></br>
            제3조 (회원 가입 및 관리)<br></br>
            ① 회원은 가입 시 정확한 정보를 제공해야 하며, 허위 정보를 제공할 경우 서비스 이용이 제한될 수 있습니다.
            <br></br>
            ② 회원은 본인의 계정을 타인에게 양도하거나 공유할 수 없습니다.
            <br></br> <br></br>
            제4조 (서비스 이용 제한)<br></br>
            ① 다음의 경우 서비스 이용이 제한될 수 있습니다.
            <br></br>
            -타인을 비방하거나 명예를 훼손하는 행위
            <br></br>
            -불법적인 정보 게시 및 유포
            <br></br>
            -서비스 운영을 방해하는 행위
            <br></br> <br></br>
            제5조 (서비스 중단 및 변경)
            <br></br>
            ① 연중 무휴, 1일 24시간 안정적으로 서비스를 제공하기 위해 최선을 다하고 있습니다만, 컴퓨터, 서버 등 정보통신설비의 보수점검, 교체 또는 고장, 통신두절 등 운영상 상당한 이유가 있는 경우 부득이 서비스의 전부 또는 일부를 중단할 수 있습니다.
            <br></br>
            <br></br>
            제6조 (책임 제한)
            <br></br>
            ① 서비스 운영자는 천재지변, 시스템 오류 등 불가피한 상황으로 인한 데이터 손실이나 이용 불편에 대해 책임을 지지 않습니다.
            <br></br> <br></br>
            제7조 (약관 변경)
            <br></br>
            ① 운영자는 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지 후 효력이 발생합니다.

        </div>
        <button id='submit' onClick={handlenext} disabled={!checked}>다음</button>
    </div>
    );
}
