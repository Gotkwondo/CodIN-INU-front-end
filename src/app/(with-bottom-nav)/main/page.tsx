import { FC } from "react";
import Link from "next/link";
import Image from "next/image";


const menuItems = [
    { label: "구해요", href: "/main/boards/need-help", icon: "/icons/need-help.png" },
    { label: "소통해요", href: "/main/boards/communicate", icon: "/icons/communicate.png" },
    { label: "비교과", href: "/main/boards/extracurricular", icon: "/icons/extracurricular.png" },
    { label: "정보대 소개", href: "/main/info/department-info", icon: "/icons/info.png" },
    { label: "중고책", href: "/main/boards/used-books", icon: "/icons/used-books.png" },
    { label: "익명 채팅방", href: "/main/anonymous/anonymous-chat", icon: "/icons/anonymous-chat.png" },
    { label: "익명 투표", href: "/main/anonymous/anonymous-vote", icon: "/icons/anonymous-vote.png" },
    { label: "수강 후기", href: "/main/info/course-reviews", icon: "/icons/course-reviews.png" },
];


const MainPage: FC = () => {
    return (
        <div className="bg-gray-100 min-h-screen p-4">
            <header className="flex items-center justify-between p-4 bg-white shadow-md">
                <h1 className="text-blue-600 text-2xl font-bold">&lt;CodIN/&gt;</h1>
                <div className="text-gray-500">🔔</div>
            </header>

            <section className="my-6">
                <h2 className="text-center text-gray-700 text-lg font-semibold">정보기술대학 캘린더</h2>
                <div className="text-center text-3xl text-gray-800 font-bold">10</div>

                <div className="grid grid-cols-7 gap-2 mt-4 text-center text-gray-700">
                    {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
                        <div key={index} className="font-semibold">{day}</div>
                    ))}
                    {/* Calendar Dates - 각 날짜에 따라 색상을 다르게 설정 */}
                    {/* 대략적인 날짜와 일정 표시를 위한 예제 */}
                    {[...Array(31)].map((_, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-lg ${index === 2 ? 'bg-red-200' : index === 4 ? 'bg-blue-200' : ''}`}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            </section>

            <section className="my-6 bg-white rounded-lg p-4 shadow-md">
                <div className="grid grid-cols-4 gap-4">
                    {/* 메뉴 아이콘들 */}
                    {menuItems.map((menu, index) => (
                        <Link href={menu.href} key={index} className="flex flex-col items-center text-center text-gray-700">
                            <div className="bg-gray-200 p-4 rounded-full mb-2">
                                <Image src={menu.icon} alt={menu.label} width={40} height={40} />
                            </div>
                            <span className="text-sm">{menu.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="my-6">
                <h2 className="text-center text-gray-700 text-lg font-semibold">게시물 랭킹</h2>
                <div className="bg-white rounded-lg p-4 shadow-md">
                    {/* 게시물 예시 */}
                    {[
                        {
                            category: "구해요",
                            title: "정보대 SNS 경진대회 같이 나갈 사람?",
                            content: "프론트 2명 정도 구하고 있습니다.",
                            views: 1956,
                            likes: 653,
                            comments: 865,
                        },
                        {
                            category: "소통해요",
                            title: "인원별 피하는 꿀팁 공유 🍯",
                            content: "인원별 피해서 정보기술대학 빨리 오는 법 공유합니다.",
                            views: 1956,
                            likes: 653,
                            comments: 865,
                        },
                        {
                            category: "소통해요",
                            title: "정보대 SNS 있으니까 넘 편하다",
                            content: "ㅎㅅㅌ",
                            views: 1956,
                            likes: 653,
                            comments: 865,
                        },
                    ].map((post, index) => (
                        <div key={index} className="border-b py-2">
                            <p className="text-gray-500 text-xs">{post.category}</p>
                            <h3 className="font-semibold text-gray-800">{post.title}</h3>
                            <p className="text-gray-600 text-sm">{post.content}</p>
                            <div className="text-xs text-gray-500 mt-2 flex justify-between">
                                <span>읽음 {post.views}회</span>
                                <span>좋아요 {post.likes}개</span>
                                <span>댓글 {post.comments}개</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


        </div>
    );
};

export default MainPage;
