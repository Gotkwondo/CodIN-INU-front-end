// data/boardData.ts

export interface Tab {
    label: string;
    value: string;
}

export interface Board {
    name: string;
    tabs: Tab[];
}

export const boardData: Record<string, Board> = {
    'need-help': {
        name: '구해요',
        tabs: [
            { label: '스터디', value: 'study' },
            { label: '프로젝트', value: 'project' },
            { label: '공모전/대회', value: 'competition' },
            { label: '소모임', value: 'gathering' },
        ],
    },
    'communicate': {
        name: '소통해요',
        tabs: [
            { label: '질문', value: 'question' },
            { label: '취업수기', value: 'job-experience' },
            { label: '꿀팁공유', value: 'tips' },
        ],
    },
    'best': {
        name: '베스트 게시물',
        tabs: [], // 베스트 게시물은 탭이 없음
    },
};
