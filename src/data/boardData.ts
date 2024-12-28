// data/boardData.ts

export interface Tab {
    label: string;
    value: string;
    postCategory: string; // 백엔드와의 맵핑용 카테고리
}

export interface Board {
    name: string;
    icon?: string;
    tabs: Tab[];
    type: 'list' | 'gallery'; // 게시판 유형: 'list' 또는 'gallery'
}

export const boardData: Record<string, Board> = {
    'need-help': {
        name: '구해요',
        tabs: [
            { label: '전체', value: 'all', postCategory: 'REQUEST' },
            { label: '스터디', value: 'study', postCategory: 'REQUEST_STUDY' },
            { label: '프로젝트', value: 'project', postCategory: 'REQUEST_PROJECT' },
            { label: '공모전/대회', value: 'competition', postCategory: 'REQUEST_COMPETITION' },
            { label: '소모임', value: 'gathering', postCategory: 'REQUEST_GROUP' },
        ],
        type: 'list', // 리스트형
    },
    'communicate': {
        name: '소통해요',
        tabs: [
            { label: '전체', value: 'all', postCategory: 'COMMUNICATION' },
            { label: '질문', value: 'question', postCategory: 'COMMUNICATION_QUESTION' },
            { label: '취업수기', value: 'job-experience', postCategory: 'COMMUNICATION_JOB' },
            { label: '꿀팁공유', value: 'tips', postCategory: 'COMMUNICATION_TIP' },
        ],
        type: 'list', // 리스트형
    },
    'extracurricular': {
        name: '비교과',
        tabs: [
            { label: '전체', value: 'all', postCategory: 'EXTRACURRICULAR' },
            { label: '정보대', value: 'question', postCategory: 'EXTRACURRICULAR_INNER' },
            { label: 'StarINU', value: 'job-experience', postCategory: 'EXTRACURRICULAR_INNER' },
            { label: '교외', value: 'tips', postCategory: 'EXTRACURRICULAR_OUTER' },
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
            { label: '판매중', value: 'selling', postCategory: 'EXTRACURRICULAR_OUTER' },
            { label: '구매중', value: 'buying', postCategory: 'EXTRACURRICULAR_INNER' },
        ],
        type: 'gallery', // 갤러리형
    },
};
