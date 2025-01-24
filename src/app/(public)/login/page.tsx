'use client';
import './login.css';
import { useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect } from 'react';
import { PostLogin } from '@/api/postLogin';
import { AuthContext } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.');
    }

    const { Auth, updateAuth } = authContext;

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    const handlePWChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setRememberMe(e.target.checked);
    };

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        if (!email || !password) {
            alert('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await PostLogin(email, password);
            console.log(`로그인 결과: ${response}`);
            const token = response.headers['authorization'];
            const refreshToken = response.headers['x-refresh-token']
            if (token) {
                console.log('Authorization 토큰:', token);
                console.log('리프레시:', refreshToken);

                // 토큰 저장 (localStorage 또는 sessionStorage)
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refresh-token', `Bearer ${refreshToken}`);
                // AuthContext 업데이트
                updateAuth({ accessToken: token });

                // 로그인 성공 후 메인 페이지로 이동
                router.push('/main');
            } else {
                console.warn('Authorization 토큰이 응답에 없습니다.');
            }
        } catch (error) {
            console.error("로그인 실패", error);
            alert('이메일 혹은 비밀번호가 틀립니다. 다시 시도해주세요.');
        }
    };

    useEffect(() => {
        if (Auth.accessToken) {
            console.log('새로운 토큰이 설정되었습니다:', Auth.accessToken);
        }
    }, [Auth.accessToken]); // Auth.accessToken의 변경을 감지

    return (
        <div className="Login">
            <div id="logo"></div>
            <div id="inputBox">
                <input
                    id="email"
                    placeholder="이메일"
                    value={email}
                    onChange={handleEmailChange}
                />
                <input
                    id="password"
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={handlePWChange}
                />
            </div>
            <div id="else">
               
                <button id="findPW" onClick={()=> router.push('/findPW')}> 비밀번호 찾기</button>
                <div id="divider"> | </div>
                <button id="signup" onClick={() => router.push('/signup')}>
                    회원가입
                </button>
            </div>
            <div id="buttonCont">
                <button id="loginBtn" onClick={handleLogin}>
                    로그인
                </button>
            </div>
        </div>
    );
}
