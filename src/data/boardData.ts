// data/boardData.ts

export interface Tab {
    label: string;
    value: string;
}

export interface Board {
    name: string;
    tabs: Tab[];
    type: 'list' | 'gallery'; // 게시판 유형: 'list' 또는 'gallery'
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
        type: 'list', // 리스트형
    },
    'communicate': {
        name: '소통해요',
        tabs: [
            { label: '질문', value: 'question' },
            { label: '취업수기', value: 'job-experience' },
            { label: '꿀팁공유', value: 'tips' },
        ],
        type: 'list', // 리스트형
    },
    'best': {
        name: '베스트 게시물',
        tabs: [], // 베스트 게시물은 탭이 없음
        type: 'list', // 리스트형
    },
    'used-books': {
        name: '중고 서적',
        tabs: [
            { label: '판매중', value: 'selling' },
            { label: '구매중', value: 'buying' },
        ],
        type: 'gallery', // 갤러리형
    },
};
