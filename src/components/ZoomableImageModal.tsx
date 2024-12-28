'use client';
import React, { useState, useRef } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5"; // React Icons에서 닫기 아이콘 사용
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // 좌우 화살표 아이콘

const ZoomableImageModal = ({ images }) => {
    // 이미지를 배열 형태로 통일
    const imageArray = Array.isArray(images) ? images : [images];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const lastTouchDistance = useRef(null);

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const goToNextImage = () => {
        if (currentIndex < imageArray.length - 1) {
            setCurrentIndex(currentIndex + 1);
            resetZoom();
        }
    };

    const goToPrevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            resetZoom();
        }
    };

    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // 마우스 또는 터치 드래그 핸들러
    const handleMouseDown = (e) => {
        setDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setStartPosition({ x: clientX - position.x, y: clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setPosition({
            x: clientX - startPosition.x,
            y: clientY - startPosition.y,
        });
    };

    const handleMouseUp = () => setDragging(false);

    // 핀치 줌 핸들러
    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            const touchDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );

            if (lastTouchDistance.current) {
                const zoomDelta = touchDistance / lastTouchDistance.current;
                setScale((prev) => Math.min(5, Math.max(1, prev * zoomDelta)));
            }
            lastTouchDistance.current = touchDistance;
        } else if (dragging && e.touches.length === 1) {
            handleMouseMove(e);
        }
    };

    const handleTouchEnd = () => {
        lastTouchDistance.current = null;
        handleMouseUp();
    };

    return (
        <div>
            {/* 가로 스크롤 이미지 리스트 */}
            <div className="flex overflow-x-auto space-x-2 p-2">
                {imageArray.map((imageUrl, index) => (
                    <div
                        key={index}
                        className="w-32 h-32 flex-shrink-0 relative cursor-pointer"
                        onClick={() => openModal(index)}
                    >
                        <Image
                            src={imageUrl}
                            alt={`Thumbnail ${index}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded"
                        />
                    </div>
                ))}
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative border-4 border-white bg-gray-400"
                        onClick={(e) => e.stopPropagation()} // 부모 클릭 방지
                        style={{
                            cursor: dragging ? "grabbing" : "grab",
                            overflow: "hidden",
                            touchAction: "none", // 터치 제스처 활성화
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* 닫기 버튼 */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2"
                            style={{
                                cursor: "pointer",
                                zIndex: 100, // 이미지 위에 버튼 표시
                            }}
                        >
                            <IoClose size={24} />
                        </button>

                        {/* 좌우 화살표 */}
                        {imageArray.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevImage}
                                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 ${
                                        currentIndex === 0
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                    }`}
                                    disabled={currentIndex === 0}
                                >
                                    <FaChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={goToNextImage}
                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 ${
                                        currentIndex === imageArray.length - 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                    }`}
                                    disabled={currentIndex === imageArray.length - 1}
                                >
                                    <FaChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {/* 이미지 */}
                        <div
                            style={{
                                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                transformOrigin: "center",
                                transition: dragging ? "none" : "transform 0.3s ease",
                            }}
                        >
                            <Image
                                src={imageArray[currentIndex]}
                                alt={`Image ${currentIndex + 1}`}
                                layout="intrinsic"
                                width={800}
                                height={600}
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ZoomableImageModal;
