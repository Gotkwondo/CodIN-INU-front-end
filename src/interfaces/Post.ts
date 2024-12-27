// src/interfaces/Post.ts
export interface Post {
    _id: string; // API 응답의 postId
    title: string;
    content: string;
    postCategory: string;
    createdAt: string;
    anonymous: boolean;
    commentCount: number;
    likeCount: number;
    scrapCount: number;
    postImageUrl: string[]; // 이미지 URL 배열
    userId: string;
}
