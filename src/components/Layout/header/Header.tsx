'use client';

import React from 'react';
import TopNav from '@/components/Layout/Navigation/topNav';
import BackButton from './BackButton';
import TitleComp from './Title';
import SearchButton from './SearchButton';
import Menu from '@/components/common/Menu';
import Logo from './Logo';
import Notice from './Notice';
import DownloadButton from './DownloadButton';
import ReloadButton from './ReloadButton';

type NavItem = { title: string; path: string };

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;

  showSearch?: boolean;
  showMenu?: boolean;
  showNotice?: boolean;
  showDownload?: boolean;
  showReload?: boolean;

  topNav?: NavItem[];

  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showLogo = false,
  showSearch = false,
  showMenu = false,
  showNotice = false,
  showDownload = false,
  showReload = false,
  topNav = undefined,
  className = '',
}) => {
  return (
    <header
      className={`
       bg-white fixed top-0
        left-1/2 -translate-x-1/2 right-0 z-50 w-full max-w-[500px]
        ${className}
      `}
    >
      <div className="relative flex w-full justify-center bg-white z-[99]">
        <div className="relative flex px-[20px] max-w-[460px] items-center justify-center w-full h-[77px]">
          {/* Left Area */}
          <div className="absolute left-[12px] flex items-center gap-2">
            {showBack ? <BackButton /> : null}
            {showLogo ? <Logo /> : null}
          </div>

          {/* Center Area */}
          <div className="flex items-end justify-center pointer-events-none px-4">
            <div className="overflow-hidden whitespace-nowrap text-ellipsis pointer-events-auto text-center">
              {title ? <TitleComp>{title}</TitleComp> : null}
            </div>
          </div>

          {/* Right Area */}
          <div className="absolute right-[12px] flex items-center gap-2">
            {showSearch ? <SearchButton /> : null}
            {/* {showMenu ? <Menu /> : null} */}
            {showNotice ? <Notice /> : null}
            {/* {showDownload ? <DownloadButton /> : null} */}
            {showReload ? <ReloadButton /> : null}
          </div>
        </div>
      </div>

      <TopNav nav={topNav} />
    </header>
  );
};

export default Header;
