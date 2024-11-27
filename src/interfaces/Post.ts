// src/interfaces/Post.ts
export interface Post {
    id: number;
    title: string;
    content: string;
    icon?: string;
    views: number;
    likes: number;
    comments: number;
    timeAgo: string; // 필수 속성
}
