'use client';
import '../signup.css';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { useContext, useState, useEffect } from 'react';
import { PostSignup } from '@/api/user/postSignup';
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import CommonBtn from '@/components/buttons/commonBtn';

export default function SignupProfile() {
  const router = useRouter();
  const [profileImg, setProfileImg] = useState<File | null>(null); // 프로필 이미지 상태 수정
  const [imgPrev, setImgPrev] = useState<string>('');
  const [nickname, setNickname] = useState<string>("");
  const [studentId, setStudentId] = useState<string>('');
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('MyConsumer must be used within a MyProvider');
  }

  const { User, updateUser } = userContext;

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
   
    if (e.target.files) {
      const file = e.target.files[0]; 
      setProfileImg(file);

       const reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onloadend = () => {
           if (reader.result){
                setImgPrev(reader.result as string);
                console.log(reader.result as string);
                console.log(profileImg);
           }
       }
    }

}



  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNickname(e.target.value);
    updateUser({ nickname: e.target.value });
  };

  useEffect(() => {
    const storedId = User.studentId;
    if (storedId) {
      setStudentId(storedId);
    }
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    if (nickname) {
      try {
       
        const response = await PostSignup(studentId, nickname, profileImg);
        console.log('회원가입 결과:', response);
        alert('회원가입 완료! 다시 로그인해주세요');
        router.push('/login');
      } catch (error) {
        console.error("회원가입 실패", error);
        const message = error.response.data.message;
        alert(message);
      }
    }else{
      alert("모든 정보를 입력해주세요.")
    }
  };

  return (
    <div className='signup'>
     <Header>
        <Header.BackButton/>
        <Header.Title>프로필 설정</Header.Title>
     </Header>
     <DefaultBody hasHeader={1}>
     
      <label htmlFor='profileImgBtn1' id='profileImgBtn'
        style={{
          backgroundImage: imgPrev ? `url(${imgPrev})` : undefined,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
        className=" w-[87px] h-[87px] border-r-[50%] bg-no-repeat bg-contain mt-[86px] ml-[24px]"
        >
        <input id='profileImgBtn1' type='file' accept='image/*' onChange={handleImageChange} />
      </label>
      <input id='nickname' placeholder='닉네임' value={nickname} onChange={handleNicknameChange}/>
     <div className="absolute bottom-[62px] w-full px-[20px] left-0 flex flex-col items-center justify-center">
      <CommonBtn id='signupBtn' text='회원가입' status={1} onClick={handleSubmit}></CommonBtn>
      </div>
      </DefaultBody>
    </div>
  );
}
