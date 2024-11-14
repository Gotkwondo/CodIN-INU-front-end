// interfaces/Post.ts

export interface Post {
    id:number;
    title: string;
    content: string;
    views: number;
    likes: number;
    comments: number;
    timeAgo: string;
    icon: string;
}
