"use client";

import React, { createContext, useState, ReactNode } from 'react';

interface Auth {
    accessToken: string;
    refreshToken: string;
}

interface AuthContextType {
    Auth: Auth;
    updateAuth: (newAuth: Partial<Auth>) => void;
    resetAuth: () => void;
}

const initialAuthState: Auth = {
    accessToken: "",
    refreshToken: ""
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode ; // children을 ReactNode로 명시
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [Auth, setAuth] = useState<Auth>(initialAuthState);

    const updateAuth = (newAuth: Partial<Auth>) => {
        setAuth((prevAuth) => ({
            ...prevAuth,
            ...newAuth,
        }));
    };

    const resetAuth = () => {
        setAuth(initialAuthState);
    };

    return (
        <AuthContext.Provider value={{ Auth, updateAuth, resetAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

