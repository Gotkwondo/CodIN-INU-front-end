import React, { createContext, useState, ReactNode } from 'react';

interface User {
    email: string;
    password: string;
    studentId: string;
    name: string;
    nickname: string;
    profileImageUrl: string;
    department: string;
}

interface UserContextType {
    User: User;
    updateUser: (newUser: Partial<User>) => void;
    resetUser: () => void;
}

const initialUserState: User = {
    email: "",
    password: "",
    studentId: "",
    name: "",
    nickname: "",
    profileImageUrl: "",
    department: "",
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode ; // children을 ReactNode로 명시
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [User, setUser] = useState<User>(initialUserState);

    const updateUser = (newUser: Partial<User>) => {
        setUser((prevUser) => ({
            ...prevUser,
            ...newUser,
        }));
    };

    const resetUser = () => {
        setUser(initialUserState);
    };

    return (
        <UserContext.Provider value={{ User, updateUser, resetUser }}>
            {children}
        </UserContext.Provider>
    );
};