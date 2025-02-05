'use client'

import SmRoundedBtn from '@/components/buttons/smRoundedBtn';
import Header from '@/components/Layout/header/Header';
import { DEPARTMENTS } from './constants';
import { labelType } from './types';
import { useState } from 'react';




const courseReviewPage = () => {
  const token = localStorage.getItem("accessToken");
  console.log('dd', token)
  const [selectedDepartment, setSelectedDepartment] = useState<labelType>({ label: '', value: ''});
  
  
  const selectDepartmentHandler = (selectedLabel: string, selectedValue: string) => {
    setSelectedDepartment({ label: selectedLabel, value: selectedValue });
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden w-full">
      <Header>
        <Header.Title>수강 후기</Header.Title>
        <Header.BackButton />
      </Header>
      <div className="mt-24">
        <div className="w-full flex justify-between">
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
      </div>
    </div>
  );` `
}

export default courseReviewPage;