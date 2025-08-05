'use client';

export default function MapLinkButton() {
  const handleMapLink = () => {
    alert('지도 링크로 이동합니다.');
    // 지도 앱 또는 url로 이동
  };

  return (
    <button
      onClick={handleMapLink}
      className="text-gray-600 hover:text-gray-900 flex items-center"
      aria-label="뒤로가기"
    >
      <div className="w-[32px] h-[32px] flex items-center justify-center">
        <img
          src="/icons/map_link.svg"
          alt="맵 링크"
        />
      </div>
    </button>
  );
}
