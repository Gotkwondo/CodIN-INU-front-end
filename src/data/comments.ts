export const commentsData = {
    boardName: {
        postId: [
            {
                id: 1,
                author: "익명",
                content: "첫 번째 댓글입니다.",
                createdAt: "2시간 전",
                likes: 3,
                replies: [
                    {
                        id: 11,
                        author: "익명",
                        content: "첫 번째 대댓글입니다.",
                        createdAt: "1시간 전",
                        likes: 1,
                    },
                ],
            },
            {
                id: 2,
                author: "익명",
                content: "두 번째 댓글입니다.",
                createdAt: "3시간 전",
                likes: 0,
                replies: [],
            },
        ],
    },
};
