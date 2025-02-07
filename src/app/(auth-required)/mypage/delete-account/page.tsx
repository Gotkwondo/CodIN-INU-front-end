'use client';
//import './login.css';
import '@/app/globals.css';
import { useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect } from 'react';
import { PostLogin } from '@/api/user/postLogin';
import { AuthContext } from '@/context/AuthContext';
import CommonBtn from '@/components/buttons/commonBtn';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import { DeleteUser } from '@/api/user/deleteUser';

export default function UserDeletePage() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("accessToken"); // 토큰 가져오기
                const response = await fetch("https://www.codin.co.kr/api/users", {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`, // Authorization 헤더 추가
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();
                if (result.success) {
                    setUserData(result.data);
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
            e.preventDefault();
    
            try {
                const response = await DeleteUser(userData.email);
                console.log(`탈퇴 결과: ${response}`);
               
                    router.push('/login');
                
            } catch (error) {
                console.error("탈퇴실패", error);
                alert('회원탈퇴를 실패하였습니다. 다시 시도해주세요.');
            }
        };
    

    
    return (
        <DefaultBody hasHeader={0}>
          <div id='title'> 회원 탈퇴를 하시겠습니까? </div>
          <CommonBtn id="deleteBtn" text="탈퇴하기" status={1} onClick={handleDelete}></CommonBtn>
        </DefaultBody>
    );
}
