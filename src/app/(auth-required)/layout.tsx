import { ReactNode } from "react";

export default function LayoutWithBottomNav({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-md mx-auto w-full">
            {children}
        </div>
    );
}
