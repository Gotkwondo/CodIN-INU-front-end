"use client";

import React from "react";

interface TitleProps {
    children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({ children }) => {
    return (
        <h1
            className="
                text-lg font-semibold text-gray-800
                leading-none text-center
            "
        >
            {children}
        </h1>
    );
};

export default Title;
