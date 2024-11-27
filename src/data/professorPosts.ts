// src/data/professorPosts.ts
import { Post } from "@/interfaces/Post";

export const professorPosts: Post[] = [
    {
        id: 1,
        title: "김교수 연구실",
        content: "인공지능과 빅데이터 연구",
        icon: "👨‍🏫",
        views: 120,
        likes: 34,
        comments: 12,
        timeAgo: "2시간 전", // 추가
    },
    {
        id: 2,
        title: "이교수 연구실",
        content: "네트워크 및 보안 연구",
        icon: "👩‍🔬",
        views: 98,
        likes: 22,
        comments: 5,
        timeAgo: "1일 전", // 추가
    },
];
