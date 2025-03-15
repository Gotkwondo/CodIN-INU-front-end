"use client";
//import './login.css';
import "@/app/globals.css";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useContext, useEffect } from "react";
import { PostLogin } from "@/api/user/postLogin";
import { AuthContext } from "@/context/AuthContext";
import CommonBtn from "@/components/buttons/commonBtn";
import DefaultBody from "@/components/Layout/Body/defaultBody";
import { PostPortal } from "@/api/user/postPortal";
import { UserContext } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [schoolLoginExplained, setSchoolLoginExplained] =
    useState<boolean>(false);
  const authContext = useContext(AuthContext);

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("MyConsumer must be used within a MyProvider");
  }

  const { User, updateUser } = userContext;

  if (!authContext) {
    throw new Error("AuthContext를 사용하려면 AuthProvider로 감싸야 합니다.");
  }

  const { Auth, updateAuth } = authContext;

  const handleStudentIdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setStudentId(e.target.value);
  };

  const handlePWChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!studentId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      updateUser({ studentId: studentId });
      console.log(`학번 업데이트: ${studentId}`);
      const response = await PostPortal(studentId, password);
      console.log(`로그인 결과: ${response}`);
      const token = response.headers["authorization"];
      const refreshToken = response.headers["x-refresh-token"];
      const code = response.status;
      if (token) {
        console.log("Authorization 토큰:", token);
        console.log("리프레시:", refreshToken);

        // 토큰 저장 (localStorage 또는 sessionStorage)
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refresh-token", `Bearer ${refreshToken}`);
        // AuthContext 업데이트
        updateAuth({ accessToken: token });

        // 로그인 성공 후 메인 페이지로 이동
        router.push("/main");
      } else if (code === 201) {
        router.push("/signup/profile");
      }
    } catch (error) {
      console.error("로그인 실패", error);
      alert(error);
      //alert('이메일 혹은 비밀번호가 틀립니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    if (Auth.accessToken) {
      console.log("새로운 토큰이 설정되었습니다:", Auth.accessToken);
    }
  }, [Auth.accessToken]); // Auth.accessToken의 변경을 감지

  // if(!schoolLoginExplained){
  //     return (
  //         <DefaultBody hasHeader={0}>
  //             <div className='absolute bottom-[62px] w-full px-[20px] left-0 flex flex-col items-center justify-center'>
  //                 <p className='text-Lm text-normal'>Codin은 <span className='text-active'>학교 계정</span>을 사용해요</p>
  //                 <p className='text-Mr text-sub mb-[48px]'>동일한 아이디와 비밀번호를 입력해주세요</p>
  //                 <img className="mb-[137px]" width="350" src='/images/schoolLoginExplain.png'/>
  //                 <div className='flex flex-row gap-[6px] mb-[22px]'>
  //                     <div className='w-[12px] h-[12px] bg-[#0D99FF] rounded-[12px]'/>
  //                     <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]'/>
  //                     <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]'/>
  //                 </div>
  //                 <CommonBtn id="loginBtn" text="이해했어요" status={1} onClick={()=>{setSchoolLoginExplained(true)}}/>
  //             </div>
  //         </DefaultBody>
  //     );
  // }

  // 구글 로그인 버튼 클릭 시 구글 로그인 페이지로 리디렉션
  const handleGoogleLogin = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      // 구글 로그인 URL로 리디렉션
      window.location.href = "https://codin.inu.ac.kr/api/auth/google";
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그인 오류");
    }
  };


  const handleappleLogin = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      // 구글 로그인 URL로 리디렉션
      window.location.href = "https://codin.inu.ac.kr/api/auth/apple";
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그인 오류");
    }
  };

  return (
    <DefaultBody hasHeader={0}>
      <div className="absolute bottom-[30%] w-full px-[20px] left-0 flex flex-col items-center justify-center">
        <img
          className="w-[171.41px] h-[45px] mb-[72px]"
          src="/images/logo.png"
        />
        {/* <div className='flex flex-col w-full gap-[12px] mb-[169px]'>
                    <input
                        className="defaultInput"
                        id="email"
                        placeholder="학교 아이디 입력"
                        value= {studentId}
                        onChange={handleStudentIdChange}
                    />
                    <input
                        className="defaultInput"
                        id="password"
                        type="password"
                        placeholder="학교 비밀번호 입력"
                        value={password}
                        onChange={handlePWChange}
                    />
                    <a href="https://portal.inu.ac.kr:444/enview/" className='text-Mr underline text-[#808080] w-full text-right'>비밀번호를 잊으셨나요?</a>
                </div> */}
        {/*
                <div id="else">
                
                    <button id="findPW" onClick={()=> router.push('/findPW')}> 비밀번호 찾기</button>
                    <div id="divider"> | </div>
                    <button id="signup" onClick={() => router.push('/signup')}>
                        회원가입
                    </button>
                </div>
                */}
        {/* <div className='flex flex-row gap-[6px] mb-[22px]'>
                    <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]'/>
                    <div className='w-[12px] h-[12px] bg-[#0D99FF] rounded-[12px]'/>
                    <div className='w-[12px] h-[12px] bg-[#EBF0F7] rounded-[12px]'/>
                </div>
                <CommonBtn id="loginBtn" text="로그인하기" status={1} onClick={handleLogin}/> */}
        <div className=" w-[160px] h-[24px] font-noto-sans-kr font-bold text-[20px] leading-[24px] text-center text-[#212121]">
          CodIN 로그인
        </div>
        <p className=" w-[221px] h-[17px]  font-noto-sans-kr font-normal text-[13px] mt-[15px] mb-[73px] leading-[17px] text-center text-[#808080]">
          CodIN은 <span className="text-active">학교 이메일 계정</span>을
          사용해요
        </p>
        <button onClick={handleGoogleLogin}>
          <img src="/images/google.png"></img>
        </button>

        <button onClick={handleappleLogin}>
          <img src="/images/apple.png" className="w-[175px] h-[42px] mt-3" ></img>
        </button>
      </div>
    </DefaultBody>
  );
}
