import { ReactNode } from 'react';
import BottomNav from '../../components/BottomNav';

export default function LayoutWithBottomNav({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
