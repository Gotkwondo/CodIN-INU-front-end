interface Reply {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
}

interface Comment {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    likes: number;
    replies: Reply[];
}

type CommentsData = {
    [boardName: string]: {
        [postId: string]: Comment[];
    };
};

// 예제 데이터
export const commentsData: CommentsData = {
    boardName1: {
        postId1: [
            {
                id: 1,
                author: "사용자1",
                content: "댓글 내용입니다.",
                createdAt: "2024-11-27T10:00:00Z",
                likes: 10,
                replies: [
                    {
                        id: 1,
                        author: "사용자2",
                        content: "답글 내용입니다.",
                        createdAt: "2024-11-27T12:00:00Z",
                        likes: 5,
                    },
                ],
            },
        ],
    },
};
