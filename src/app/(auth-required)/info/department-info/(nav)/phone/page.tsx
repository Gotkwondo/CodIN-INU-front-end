import Link from 'next/link';

export default function Phone() {
  const departments = [
    {
      id: 1,
      name: '컴퓨터 공학부',
      image: '/images/컴퓨터공학부.png',
      departmentName: 'COMPUTER_SCI',
    },
    {
      id: 2,
      name: '임베디드시스템공학과',
      image: '/images/임베디드시스템공학과.png',
      departmentName: 'EMBEDDED',
    },
    {
      id: 3,
      name: '정보통신학과',
      image: '/images/정보통신학과.png',
      departmentName: 'INFO_COMM',
    },
    {
      id: 4,
      name: '교학실',
      image: '/images/교학실.png',
      departmentName: 'IT_COLLEGE',
    },
  ];

  return (
    <ul className="grid grid-cols-2 gap-[18px] w-full">
      {departments.map(department => (
        <li key={department.id}>
          <Link href={`./${department.departmentName}`}>
            {/* 0 5px 8.5px 1px rgba(212, 212, 212, 0.59); */}
            <div className="flex flex-1 rounded-[15px] shadow-[0px_5px_8.5px_1px_rgba(212,212,212,0.59)] cursor-pointer active:bg-[#EBF0F7] aspect-[169/198] items-center justify-center">
              <div className="flex flex-col items-center gap-[16px] justify-center ">
                <img
                  src={department.image.replace('/public', '')}
                  alt={department.name}
                  className="min-h-[98px] max-h-[98px]"
                />
                <p className="text-center text-Lm">{department.name}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
