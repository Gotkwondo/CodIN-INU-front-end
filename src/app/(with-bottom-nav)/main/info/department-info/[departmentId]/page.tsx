import { departments } from "@/data/departmentInfo";

interface DepartmentDetailPageProps {
    params: {
        departmentId: string;
    };
}

export default function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
    const department = departments.find((dept) => dept.id === params.departmentId);

    if (!department) {
        return (
            <div className="p-4 bg-gray-100 min-h-screen">
                <h1 className="text-xl font-bold text-center text-gray-800">학과를 찾을 수 없습니다.</h1>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-xl font-bold text-center text-gray-800 mb-4">{department.name}</h1>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 shadow">
                <img
                    src="/images/map.png" // 맵 이미지는 하드코딩된 것으로 가정
                    alt="지도"
                    className="w-full h-40 object-cover rounded"
                />
            </div>
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                {department.location && (
                    <p className="mb-2">
                        <strong>위치:</strong> {department.location}
                    </p>
                )}
                {department.phone && (
                    <p className="mb-2">
                        <strong>전화번호:</strong> {department.phone}
                    </p>
                )}
                {department.fax && (
                    <p className="mb-2">
                        <strong>FAX:</strong> {department.fax}
                    </p>
                )}
                {department.openHours && (
                    <p className="mb-2">
                        <strong>운영 시간:</strong> {department.openHours}
                    </p>
                )}
                {department.vacationHours && (
                    <p className="mb-4">
                        <strong>방학 중 운영 시간:</strong> {department.vacationHours}
                    </p>
                )}
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">교수진</h2>
            <ul className="space-y-4">
                {department.professors?.map((professor, index) => (
                    <li key={index} className="flex items-start space-x-4 p-4 bg-white border rounded shadow">
                        <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold">
                            {professor.name[0]}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">{professor.name}</p>
                            <p className="text-sm text-gray-600">{professor.position}</p>
                            <p className="text-sm text-gray-600">{professor.phone}</p>
                            <p className="text-sm text-blue-500">{professor.email}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
