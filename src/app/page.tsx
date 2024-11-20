import Image from "next/image";

export default function Home() {
    return (
        <div className="max-w-5xl mx-auto p-4">
            <header className="bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 text-white text-center py-10 rounded-md">
                <h1 className="text-4xl font-bold">CodIN: 코드 안의 사람들</h1>
                <p className="text-xl mt-2">Code INU, Code in, Code 人</p>
            </header>

            <section className="mt-10 text-center">
                <p className="text-lg">
                    학우들이 코드 안에서 뿐만 아니라 밖에서도 다같이 어울릴 수 있기를
                    바라는 마음으로 만들어진 <b>CodIN</b>.
                </p>
                <p className="text-lg mt-2">
                    네트워킹, 정보 공유, 협업, 그리고 미래를 위한 취업 정보를 모두
                    CodIN에서 만나보세요!
                </p>
            </section>

            <section className="mt-10">
                <h2 className="text-2xl font-bold mb-4">CodIN의 핵심 기능</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li className="p-4 border rounded-md shadow-md bg-gray-50">
                        🎯 학생들 간의 네트워킹 강화
                    </li>
                    <li className="p-4 border rounded-md shadow-md bg-gray-50">
                        📚 학과 및 대학 정보의 효율적인 전달
                    </li>
                    <li className="p-4 border rounded-md shadow-md bg-gray-50">
                        🤝 프로젝트 협업 및 스터디 그룹 형성 촉진
                    </li>
                    <li className="p-4 border rounded-md shadow-md bg-gray-50">
                        💼 취업 정보 및 비교과 활동 기회 공유
                    </li>
                </ul>
            </section>

            <section className="mt-10">
                <h2 className="text-2xl font-bold mb-4">CodIN UI/UX</h2>
                <p>
                    CodIN은 정보대의 색상을 반영한 <b>깔끔하고 친근한 디자인</b>을
                    사용합니다. HTML 형식의 태그 디자인으로 흥미를 유발합니다.
                </p>
                <div className="flex flex-col md:flex-row gap-4 mt-6">
                    <Image
                        src="/images/MainPage.jpg"
                        alt="Main Page Design"
                        width={600}
                        height={400}
                        className="rounded-md shadow-md"
                    />
                    <Image
                        src="/images/구해요_Page.jpg"
                        alt="게시판 디자인"
                        width={600}
                        height={400}
                        className="rounded-md shadow-md"
                    />
                </div>
            </section>

            <section className="mt-10">
                <h2 className="text-2xl font-bold mb-4">깨끗하고 안전한 CodIN</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>✔️ AI 기반 클린봇으로 부적절한 게시글 필터링</li>
                    <li>✔️ 비표준 포트 사용 및 방화벽 구축</li>
                    <li>✔️ 정기적인 보안 검사와 데이터 백업</li>
                </ul>
            </section>

            <section className="mt-10">
                <h2 className="text-2xl font-bold mb-4">CodIN 팀 구성</h2>
                <p>
                    다양한 역량을 갖춘 CodIN 팀원들이 함께합니다. 자세한 내용은{" "}
                    <a
                        href="https://www.notion.so/12110687d0458126973afb31c717a497?pvs=21"
                        className="text-blue-500 hover:underline"
                    >
                        여기
                    </a>
                    에서 확인하세요.
                </p>
            </section>

            <footer className="mt-10 text-center py-6 bg-gray-100 rounded-md">
                <p>© 2024 CodIN 프로젝트 팀</p>
            </footer>
        </div>
    );
}
