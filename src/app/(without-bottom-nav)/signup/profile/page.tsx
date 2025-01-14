'use client';
import '../signup.css';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/UserContext';
import { useContext, useState, useEffect } from 'react';
import { PostSignup } from '@/api/postSignup';

export default function SignupProfile() {
  const router = useRouter();
  const [profileImg, setProfileImg] = useState<string>(); // 프로필 이미지 상태 수정
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>('');
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('MyConsumer must be used within a MyProvider');
  }

  const { User, updateUser } = userContext;

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
                updateUser({profileImageUrl : profileImg});
           }
       }
    }

}



  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNickname(e.target.value);
    updateUser({ nickname: e.target.value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
    updateUser({ name: e.target.value });
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      updateUser({ email: storedEmail });
    }
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    if (nickname && profileImg) {
      try {
       
        const response = await PostSignup(User);
        console.log('회원가입 결과:', response);
        router.push('/main');
      } catch (error) {
        console.error("회원가입 실패", error);
        alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    }
  };

  useEffect(() => {
    if (nickname) {
      updateUser({ nickname });
    }
  }, [nickname]);

  useEffect(() => {
    if (profileImg) {
      updateUser({ profileImageUrl: profileImg });
    }
  }, [nickname, profileImg]);

  return (
    <div className='signup'>
      <div id='back_btn'  onClick={()=> router.push('/signup/info')}>{`<`}</div>
      <div id='profile_title'>프로필 생성</div>
      <label htmlFor='profileImgBtn1' id='profileImgBtn'
        style={{
          backgroundImage: profileImg ? `url(${profileImg})` : undefined,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}>
        <input id='profileImgBtn1' type='file' accept='image/*' onChange={handleImageChange} />
      </label>
      <input id='nickname' placeholder='닉네임' value={nickname} onChange={handleNicknameChange} />
      <input id='name' placeholder='이름' value={name} onChange={handleNameChange} />
      <button id='submit' onClick={handleSubmit}>회원가입</button>
    </div>
  );
}
