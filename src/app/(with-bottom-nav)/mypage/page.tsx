import Link from "next/link";

export default function MyPage() {
    // 메뉴 항목 배열
    const menuItems = [
        { label: "프로필 편집", href: "/mypage/profile/edit" },
        { label: "게시글", href: "/mypage/profile/posts" },
        { label: "좋아요", href: "/mypage/profile/likes" },
        { label: "댓글", href: "/mypage/profile/comments" },
        { label: "스크랩", href: "/mypage/profile/scraps", isSpacer: true },
        { label: "알림 설정", href: "/mypage/settings/notifications" },
        { label: "차단 관리", href: "/mypage/settings/block", isSpacer: true },
        { label: "로그아웃", href: "/mypage/logout" },
        { label: "회원 탈퇴", href: "/mypage/delete-account" },
    ];



    return (
        <div className="min-h-screen bg-white p-4">
            {/* 사용자 정보 섹션 */}
            <div className="flex items-center justify-between px-4 py-8">
                {/* 프로필 이미지 */}
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div>
                        {/* 사용자 이름 */}
                        <h2 className="text-base font-semibold text-gray-800">홍길동</h2>
                        {/* 이메일 */}
                        <p className="text-sm text-gray-500">email1234@gmail.com</p>
                    </div>
                </div>
                {/* 포인트 */}
                <span className="bg-blue-500 text-white text-sm font-bold py-1 px-3 rounded-full">
                    20P
                </span>
            </div>
            {/* 관심사 */}
            <p className="text-sm text-blue-500 text-start ml-4 mt-2 mb-4">
                관심사 · 코딩 · 프론트 · 디자인
            </p>

            {/* 메뉴 리스트 */}
            <ul className="text-sm">
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`flex justify-between items-center px-4 py-2 ${
                            item.isSpacer ? "mb-4" : ""
                        }`} // 여유 공간 추가
                    >
                        <Link href={item.href} className="text-gray-800">
                            {item.label}
                        </Link>
                        <span className="text-gray-500">&gt;</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
