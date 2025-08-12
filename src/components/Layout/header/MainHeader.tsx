'use client';

import React from 'react';
import Logo from './Logo';
import Notice from './Notice';

const Header = () => {
  return (
    <header
      className="
                flex items-center justify-center
                px-[20px] h-[80px] bg-white fixed top-0
                left-1/2 -translate-x-1/2 right-0 z-50
                w-full
                max-w-[500px] 
            "
    >
      {/* 중앙 영역: Title (항상 중앙 고정) */}
      <div
        className="
          flex justify-center
          pointer-events-none
          px-4
        "
      >
        <div>
          <Logo />
        </div>
      </div>

      {/* 오른쪽 영역: SearchButton, Menu */}
      <div className="absolute right-0 flex items-center gap-2">
        <Notice />
      </div>
    </header>
  );
};

export default Header;
