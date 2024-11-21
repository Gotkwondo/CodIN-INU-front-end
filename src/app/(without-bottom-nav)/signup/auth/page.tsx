'use client';

import '../signup.css';
import {useState} from 'react';
import { useRouter } from 'next/navigation';

export default function SignupAuth() {
  const router = useRouter();
    const [code, setCode] = useState<string[]>(new Array(6).fill(""));

  // `element`는 HTMLInputElement로 타입 지정
  const handleInputChange = (element: HTMLInputElement, index: number) => {
    // `newCode`는 `code` 배열의 복사본
    let newCode = [...code];
    newCode[index] = element.value;  // `element.value`를 사용

    // 상태 업데이트
    setCode(newCode);

    // 다음 입력으로 포커스 이동
    if (element.nextSibling && element.value) {
      const nextElement = element.nextSibling as HTMLElement; // 타입 단언
      nextElement.focus();
    }
  };

    return (
        <div className='signup'>
               <div id='back_btn'> {`<`} </div>
            <div id='title'>인증번호 입력</div>
            <div className="code-inputs">
                {code.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="code-input"
                    value={digit}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target, index)}
                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
                />
                ))}
            </div>
            <button id='submit' onClick={()=>router.push('/signup/password')}>다음</button>
        </div>
    );
}
