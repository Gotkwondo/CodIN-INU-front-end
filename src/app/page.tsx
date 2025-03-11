"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push("/login");
    }, [router]);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-900 text-gray-100">
        </div>
    );
}
