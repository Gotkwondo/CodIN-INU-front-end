import { boardData } from "@/data/boardData";

export const getDefaultImageUrl = (title: string): string => {
    if (title.includes("[정통]")) return "/images/정보통신학과.png";
    if (title.includes("[컴공]")) return "/images/컴퓨터공학부.png";
    if (title.includes("[임베]")) return "/images/임베디드시스템공학과.png";
    return "/images/교학실.png";
};

export const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    if (diff < 60) return "방금 전";
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return `${Math.floor(diff / 86400)}일 전`;
};

export const mapPostCategoryToName = (postCategory: string): string => {
    for (const boardKey in boardData) {
        const board = boardData[boardKey];
        if (board) return board.name;
    }
    return "알 수 없음";
};

export const mapPostCategoryToBoardPath = (postCategory: string): string | null => {
    for (const boardKey in boardData) {
        const board = boardData[boardKey];
        const tab = board.tabs.find((tab) => tab.postCategory === postCategory);
        if (tab) return boardKey;
    }
    return null;
};
