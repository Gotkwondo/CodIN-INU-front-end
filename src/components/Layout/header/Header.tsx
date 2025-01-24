"use client";

import React, { ReactNode } from "react";
import BackButton from "./BackButton";
import Title from "./Title";
import SearchButton from "./SearchButton";
import Menu from "../../common/Menu";
import MenuItem from "@/components/common/Menu/MenuItem";

/** Header의 자식 요소 타입 */
interface HeaderProps {
    children: ReactNode;
}

/**
 * 특정 컴포넌트(BackButton, Title 등)와 일치하는지 확인하는 헬퍼 함수
 */
function isElementType(child: ReactNode, component: any) {
    return React.isValidElement(child) && child.type === component;
}

const Header = ({ children }: HeaderProps) => {
    let backButton: ReactNode = null;
    let title: ReactNode = null;
    let searchButton: ReactNode = null;
    let menu: ReactNode = null;
    const others: ReactNode[] = [];

    // children 순회하면서 원하는 컴포넌트를 찾아서 할당
    React.Children.forEach(children, (child) => {
        if (isElementType(child, Header.BackButton)) {
            backButton = child;
        } else if (isElementType(child, Header.Title)) {
            title = child;
        } else if (isElementType(child, Header.SearchButton)) {
            searchButton = child;
        } else if (isElementType(child, Header.Menu)) {
            menu = child;
        } else {
            others.push(child);
        }
    });

    return (
        <header
            className="
                flex items-center justify-between
                px-4 h-14 bg-white shadow-md fixed top-0
                left-0 right-0 z-10
            "
        >
            {/* 왼쪽 영역: BackButton */}
            <div className="flex items-center gap-2">
                {backButton}
            </div>

            {/* 중앙 영역: Title (항상 중앙 고정) */}
            <div
                className="
                absolute inset-0 flex items-center justify-center
                pointer-events-none
            "
            >
                {title}
            </div>

            {/* 오른쪽 영역: SearchButton, Menu */}
            <div className="flex items-center gap-2">
                {searchButton}
                {menu}
            </div>
        </header>
    );
};

// 확장 속성으로 각 컴포넌트를 연결
Header.BackButton = BackButton;
Header.Title = Title;
Header.SearchButton = SearchButton;
Header.Menu = Menu;
Header.MenuItem = MenuItem;

export default Header;
