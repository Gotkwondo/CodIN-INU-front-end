// src/data/departmentInfo.ts
export interface Professor {
    name: string;
    position: string;
    phone?: string;
    email?: string;
}

export interface Department {
    id: string;
    name: string;
    image: string;
    location?: string;
    phone?: string;
    fax?: string;
    openHours?: string;
    vacationHours?: string;
    professors?: Professor[];
}

export const departments: Department[] = [
    {
        id: "computer-engineering",
        name: "컴퓨터공학부",
        image: "/images/computer-engineering.png",
        location: "7호관 409호",
        phone: "032-835-8490",
        fax: "032-835-0780",
        openHours: "평일 09:00 - 21:00",
        vacationHours: "평일 09:00 - 17:00",
        professors: [
            {
                name: "오지은",
                position: "조교",
                phone: "032-835-8760",
                email: "seseseoh@inu.ac.kr",
            },
            {
                name: "이름",
                position: "교수",
                phone: "032-835-8761",
                email: "example@inu.ac.kr",
            },
        ],
    },
    {
        id: "embedded-systems",
        name: "임베디드시스템공학과",
        image: "/images/embedded-systems.png",
    },
    {
        id: "info-communication",
        name: "정보통신공학과",
        image: "/images/info-communication.png",
    },
    {
        id: "common-class",
        name: "교학실",
        image: "/images/common-class.png",
    },
];
