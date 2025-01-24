'use client';
import '@/app/(public)/signup/signup.css';
import { useRouter } from 'next/navigation';
import { useState, useContext, useEffect } from 'react';
import { PutPassword } from '@/api/putPassword';
import { useParams } from 'next/navigation';


export default function SignupPw() {
    const router = useRouter();
    const [ password, setPassword] = useState<string>("");
    const [ confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const { code } = useParams();


    useEffect(() => {
      if (!code) {
        console.error("code가 URL에 존재하지 않습니다");
      }
    }, [code]);


    const validatePassword = (value: string) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return passwordRegex.test(value);
      };

      const handlePasswordChange = (e:any) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        if (!validatePassword(newPassword)) {
          setPasswordError("비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다");
        } else {
          setPasswordError("");
        }

        if (newPassword !== confirmPassword) {
          setConfirmPasswordError("비밀번호가 일치하지 않습니다");
        } else {
          setConfirmPasswordError("");
        }
      };

      const handleConfirmPasswordChange = (e:any) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);

        if (newConfirmPassword !== password) {
          setConfirmPasswordError("비밀번호가 일치하지 않습니다");
        } else {
          setConfirmPasswordError("");
        }
      };

      const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();

        if (!passwordError && !confirmPasswordError && password && confirmPassword) {
           try {

                              const response = await PutPassword(code, password);
                              console.log('결과:', response);
                              router.push('/login');
                            } catch (error) {
                              console.error("비밀번호 변경경 실패", error);
                              const message = error.response.data.message;
                              alert(message);
                            }
                } else {
          console.log("비밀번호 설정 오류");
        }
      };


    return (
        <div className='signup'>
        <div id='back_btn' onClick={()=>router.push('/findPW')}> {`<`} </div>
        <div id='title'>비밀번호 재설정</div>
        <input
        type='password'
        id='email'
        placeholder='비밀번호'
        value={password}
        onChange={handlePasswordChange}
        >
        </input>
        {passwordError && (
            <p className="error-message">{passwordError}</p>
          )}
        <input
        type="password"
        id='password'
        placeholder='비밀번호 재입력'
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        ></input>
         {confirmPasswordError && (
            <p className="error-message1">{confirmPasswordError}</p>
          )}
        <button id='submit' onClick={handleSubmit}>다음</button>
    </div>
    );
}
