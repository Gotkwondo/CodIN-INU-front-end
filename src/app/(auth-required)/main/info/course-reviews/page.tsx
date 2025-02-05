'use client'

import SmRoundedBtn from '@/components/buttons/smRoundedBtn';
import Header from '@/components/Layout/header/Header';
import { DEPARTMENTS } from './constants';
import { labelType } from './types';
import { useState } from 'react';
import { Input } from '@/components/input/Input';




const courseReviewPage = () => {
  const token = localStorage.getItem("accessToken");
  console.log('dd', token)
  const [selectedDepartment, setSelectedDepartment] = useState<labelType>({ label: '', value: ''});
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  
  const selectDepartmentHandler = (selectedLabel: string, selectedValue: string) => {
    setSelectedDepartment({ label: selectedLabel, value: selectedValue });
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden w-full relative">
      <Header>
        <Header.Title>수강 후기</Header.Title>
        <Header.BackButton />
      </Header>
      <div className="mt-28">
        <div className="flex flex-col w-full">
          <div className="w-full flex justify-between ">
            {DEPARTMENTS.map(({ label, value }: labelType) => {
              return (
                <SmRoundedBtn
                  key={`selectDepartment_${value}`}
                  text={label}
                  onClick={() => selectDepartmentHandler(label, value)}
                  status={value === selectedDepartment.value ? 1 : 0}
                />
              );
            })}
          </div>
          <div className="mt-4 w-full">
            <Input
              className="w-full"
              placeholder="과목명, 교수명 입력"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );` `
}

export default courseReviewPage;