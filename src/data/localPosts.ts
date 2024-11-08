// data/localPosts.ts

import { Post } from '@/interfaces/Post';

export const localPosts: Record<string, Record<string, Post[]>> = {
    'need-help': {
        study: [
            {
                title: '스터디 모집합니다',
                content: '함께 공부하실 분 모집합니다.',
                views: 100,
                likes: 10,
                comments: 5,
                timeAgo: '1시간 전',
                icon: '/icons/study.png',
            },
            // ... 추가 더미 데이터
        ],
        project: [
            {
                title: '프로젝트 팀원 구합니다',
                content: '프로젝트 함께 하실 분 구합니다.',
                views: 200,
                likes: 20,
                comments: 10,
                timeAgo: '2시간 전',
                icon: '/icons/project.png',
            },
            // ... 추가 더미 데이터
        ],
        competition: [
            {
                title: '공모전 참가자 모집',
                content: '공모전 함께 도전하실 분!',
                views: 150,
                likes: 15,
                comments: 7,
                timeAgo: '3시간 전',
                icon: '/icons/competition.png',
            },
            // ... 추가 더미 데이터
        ],
        gathering: [
            {
                title: '소모임 멤버 모집',
                content: '소모임에 참여하실 분들 모집합니다.',
                views: 120,
                likes: 12,
                comments: 6,
                timeAgo: '4시간 전',
                icon: '/icons/gathering.png',
            },
            // ... 추가 더미 데이터
        ],
    },
    'communicate': {
        question: [
            {
                title: '질문 있습니다',
                content: '이것에 대해 아시는 분 계신가요?',
                views: 80,
                likes: 8,
                comments: 4,
                timeAgo: '5시간 전',
                icon: '/icons/question.png',
            },
            // ... 추가 더미 데이터
        ],
        'job-experience': [
            {
                title: '취업 성공기',
                content: '저의 취업 경험을 공유합니다.',
                views: 90,
                likes: 9,
                comments: 5,
                timeAgo: '6시간 전',
                icon: '/icons/job.png',
            },
            // ... 추가 더미 데이터
        ],
        tips: [
            {
                title: '꿀팁 공유합니다',
                content: '유용한 정보를 공유합니다.',
                views: 110,
                likes: 11,
                comments: 6,
                timeAgo: '7시간 전',
                icon: '/icons/tips.png',
            },
            // ... 추가 더미 데이터
        ],
    },
    'best': {
        // 베스트 게시물은 탭이 없으므로 단일 배열
        default: [
            {
                title: '베스트 게시물 1',
                content: '인기 게시물 내용입니다.',
                views: 1000,
                likes: 100,
                comments: 50,
                timeAgo: '1일 전',
                icon: '/icons/best.png',
            },
            // ... 추가 더미 데이터
        ],
    },
};
