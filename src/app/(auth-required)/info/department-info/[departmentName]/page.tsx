'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '@/api/clients/apiClient'; // apiClient import
import Header from '@/components/Layout/header/Header';
import DefaultBody from '@/components/Layout/Body/defaultBody';

import Phone from '@public/icons/phone.svg';
import Fax from '@public/icons/fax.svg';
import Location from '@public/icons/location.svg';
import Open from '@public/icons/opentime.svg';
import Vacation from '@public/icons/vacation.svg';
import Email from '@public/icons/email.svg';
import ShadowBox from '@/components/common/shadowBox';
import Link from 'next/link';

export default function DepartmentPage() {
  const params = useParams();
  const router = useRouter();

  const departmentName = Array.isArray(params.departmentName)
    ? params.departmentName[0]
    : params.departmentName;

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const departmentNamesMap = {
    COMPUTER_SCI: '컴퓨터공학부',
    INFO_COMM: '정보통신학과',
    EMBEDDED: '임베디드시스템공학과',
    STAFF: '교직원',
    IT_COLLEGE: '정보기술대학',
  };

  useEffect(() => {
    if (!departmentName) {
      console.log('departmentName is not available');
      return;
    }

    const fetchDepartmentInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(`/info/office/${departmentName}`); // apiClient 사용

        if (response.data.success) {
          setInfo(response.data);
          console.log('API Response:', response.data);
        } else {
          throw new Error(
            response.data.message || '데이터를 가져오는 데 실패했습니다.'
          );
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message || '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentInfo();
  }, [departmentName]);

  return (
    <div className="bg-white min-h-screen min-w-full">
      <Header
        showBack
        title={
          departmentName
            ? `${departmentNamesMap[departmentName] || departmentName}`
            : '로딩 중...'
        }
      />

      <DefaultBody hasHeader={1}>
        {loading ? (
          <p className="text-center text-gray-500 text-lg">로딩 중...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : info ? (
          <div className=" bg-white rounded-lg w-full">
            <div className="rounded-[8px] shadow-[0px_5px_8.5px_1px_rgba(212,212,212,0.59)] p-[22px]">
              <div className="mb-[32px]">
                <img
                  src={info.data.img}
                  alt={`${
                    departmentNamesMap[departmentName] || departmentName
                  } 이미지`}
                  className="object-contain w-full"
                />
              </div>
              <div className="">
                <div className="flex flex-col gap-[9px] text-[12px] font-medium">
                  <div className="flex">
                    <p className="flex gap-[6px]">
                      <Phone />
                      <span className="w-[61px]">전화번호</span>
                    </p>
                    <p className="font-normal ml-[21px]">
                      {info.data.officeNumber}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="flex gap-[6px]">
                      <Fax />
                      <span className="w-[61px]">Fax</span>
                    </p>
                    <p className="font-normal ml-[21px]">{info.data.fax}</p>
                  </div>
                  <div className="flex">
                    <p className="flex gap-[6px]">
                      <Location />
                      <span className="w-[61px]">위치</span>
                    </p>
                    <p className="font-normal ml-[21px]">
                      {info.data.location}
                    </p>
                  </div>
                </div>
                <hr className="my-[19px]" />
                <div className="flex flex-col gap-[9px] text-[12px] font-medium">
                  <div className="flex">
                    <p className="flex gap-[6px]">
                      <Open />
                      <span className="w-[61px]">운영 시간</span>
                    </p>
                    <p className="font-normal ml-[21px] break-keep">
                      {info.data.open}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="flex gap-[6px]">
                      <Vacation />
                      <span className="w-[61px]">휴무일</span>
                    </p>
                    <p className="font-normal ml-[21px] break-keep">
                      {info.data.vacation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[22px]">
              <div className="flex flex-col gap-[12px]">
                {info.data.officeMember.map((member, index) => (
                  <ShadowBox
                    key={index}
                    className="flex py-[12px] px-[14px] overflow-hidden"
                  >
                    <div className="flex items-center min-w-[106px] gap-[17px] overflow-hidden">
                      <img
                        src="/icons/chat/DeafultProfile.png"
                        className="w-[50px] h-[50px]"
                        width={50}
                        height={50}
                      />
                      <div className="text-normal">
                        <p className="text-[14px] font-bold">{member.name}</p>
                        <p className="text-sr text-sub">{member.position}</p>
                      </div>
                    </div>
                    <div className="text-normal text-sr ml-[min(50px,10vw)]">
                      <div className="flex">
                        <Phone />
                        <span className="leading-[18px] ml-[8px]">
                          {member.number}
                        </span>
                      </div>
                      <Link
                        href={`mailto:${member.email}`}
                        className="flex mt-[9px]"
                      >
                        <Email />
                        <span className="leading-[18px] ml-[8px]">
                          {member.email}
                        </span>
                      </Link>
                    </div>
                  </ShadowBox>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">데이터가 없습니다.</p>
        )}
      </DefaultBody>
    </div>
  );
}
