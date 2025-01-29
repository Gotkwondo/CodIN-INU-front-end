'use client';
import './signup.css';
import { useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect } from 'react';
import { PostPortal } from '@/api/user/postPortal';
import { UserContext } from '@/context/UserContext';



export default function SignupPage() {
    const router = useRouter();
    const [studentId, setStudentId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
   
    const userContext = useContext(UserContext);

    if (!userContext) {
      throw new Error('MyConsumer must be used within a MyProvider');
    }
  
    const { User, updateUser } = userContext;


    const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setStudentId(e.target.value);
    };

    const handlePWChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    const handleNext = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        if (!studentId || !password) {
            alert('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        try {
            updateUser({ studentId: studentId});
            console.log(`학번 업데이트: ${studentId}`);
            const response = await PostPortal(studentId, password);

            console.log(`포탈 인증 결과: ${response}`);
          
                // 포탈 인증 성공 후 프로필 설정 페이지로 이동
                router.push('/signup/profile');
            } catch (error) {
            console.error("포탈 인증 실패", error);
            const message = error.response.data.message;
            alert(message);
            router.push('/signup/profile');
        }
    };

    return (
        <div className="signup">
            <div id='back_btn'  onClick={()=> router.push('/login')}>{`<`}</div>
            <div id='profile_title'>포탈 인증</div>

            <div id="inputBox">
                <input
                    id="email"
                    placeholder="inu.ac.kr 포탈 아이디"
                    value={studentId}
                    onChange={handleStudentIdChange}
                />
                <input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={handlePWChange}
                />
            </div>
         
            
                <button id="submit" onClick={handleNext}>다음</button>
            
        </div>
    );
}
