'use client';
import '../signup.css';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { useContext, useState, useEffect } from 'react';
import { PostSignup } from '@/api/user/postSignup';

export default function SignupProfile() {
  const router = useRouter();
  const [profileImg, setProfileImg] = useState<File | null>(null); // 프로필 이미지 상태 수정
  const [imgPrev, setImgPrev] = useState<string>('');
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('MyConsumer must be used within a MyProvider');
  }

  const { User, updateUser } = userContext;

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>):void => {
    const files = e.target.files;
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
      <div id='back_btn'  onClick={()=> router.push('/signup')}>{`<`}</div>
      <div id='profile_title'>프로필 등록</div>
      <label htmlFor='profileImgBtn1' id='profileImgBtn'
        style={{
          backgroundImage: imgPrev ? `url(${imgPrev})` : undefined,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}>
        <input id='profileImgBtn1' type='file' accept='image/*' onChange={handleImageChange} />
      </label>
      <input id='nickname' placeholder='닉네임' value={nickname} onChange={handleNicknameChange} />
      <button id='submit' onClick={handleSubmit}>회원가입</button>
    </div>
  );
}
