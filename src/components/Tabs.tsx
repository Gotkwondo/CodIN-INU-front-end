// components/Tabs.tsx
'use client';

import { FC } from 'react';

interface TabsProps<T> {
    tabs: { label: string; value: T }[];
    activeTab: T;
    onTabChange: (tab: T) => void;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const Tabs: FC<TabsProps<any>> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <nav className="flex justify-center space-x-4 mt-2 text-gray-500 text-lg">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    className={classNames(
                        'hover:text-gray-800',
                        activeTab === tab.value ? 'text-gray-800 font-semibold' : ''
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default Tabs;
