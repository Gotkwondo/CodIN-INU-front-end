'use client';

import { FC } from 'react';

interface TabsProps<T> {
    tabs: { label: string; value: T }[]; // 탭 목록
    activeTab: T; // 현재 활성화된 탭
    onTabChange: (tab: T) => void; // 탭 변경 함수
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const Tabs: FC<TabsProps<any>> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <nav className="flex overflow-x-auto no-scrollbar space-x-4 mt-2 text-gray-500">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={classNames(
                        'hover:text-gray-800 px-4 py-2 rounded whitespace-nowrap transition',
                        activeTab === tab.value ? 'text-gray-800 font-semibold' : 'text-sm sm:text-base lg:text-lg'
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default Tabs;
