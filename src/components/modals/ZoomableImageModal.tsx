'use client';
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface ZoomableImageModalProps {
    images: string | string[];
    mode?: "list" | "banner"; // 기본값: list
}

const AUTO_ADVANCE_DELAY = 5000; // 5초마다 자동 전환
const PROGRESS_UPDATE_INTERVAL = 100; // 프로그래스 바 업데이트 간격 (ms)

const ZoomableImageModal: React.FC<ZoomableImageModalProps> = ({
                                                                   images,
                                                                   mode = "list",
                                                               }) => {
    // 이미지를 배열로 통일
    const imageArray = Array.isArray(images) ? images : [images];

    // 공통 모달 상태 (list 모드에서 이미지 클릭 시 확대 모달)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const openModal = (index: number) => {
        setModalIndex(index);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 모달 내 줌 관련 상태 (리스트 모드 확대 모달과 배너 모드 모두 재사용 가능)
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const lastTouchDistance = useRef<number | null>(null);

    const resetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setDragging(true);
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        setStartPosition({ x: clientX - position.x, y: clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!dragging) return;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        setPosition({
            x: clientX - startPosition.x,
            y: clientY - startPosition.y,
        });
    };

    const handleMouseUp = () => setDragging(false);

    const handleTouchMove = (e: React.TouchEvent) => {
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

    // =============================
    // Banner 모드용 캐러셀 상태 및 로직
    // =============================
    const [bannerIndex, setBannerIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const bannerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    // 이미지 전환 함수 (배너 모드)
    const goToNextBanner = useCallback(() => {
        setBannerIndex((prev) => (prev + 1) % imageArray.length);
        setProgress(0);
        startTimeRef.current = Date.now();
    }, [imageArray.length]);

    const goToPrevBanner = () => {
        setBannerIndex((prev) =>
            prev === 0 ? imageArray.length - 1 : prev - 1
        );
        setProgress(0);
        startTimeRef.current = Date.now();
    };

    // 자동 전환 및 프로그래스 바 업데이트 (배너 모드)
    useEffect(() => {
        if (mode !== "banner") return;
        // 프로그래스 업데이트
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const percentage = Math.min(100, (elapsed / AUTO_ADVANCE_DELAY) * 100);
            setProgress(percentage);
            if (percentage >= 100) {
                goToNextBanner();
            }
        }, PROGRESS_UPDATE_INTERVAL);

        return () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [goToNextBanner, mode]);

    // 터치/swipe를 통한 이미지 전환 (배너 모드)
    const bannerTouchStartRef = useRef<number | null>(null);
    const handleBannerTouchStart = (e: React.TouchEvent) => {
        bannerTouchStartRef.current = e.touches[0].clientX;
        // 터치 시작 시 프로그래스 초기화
        setProgress(0);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
    const handleBannerTouchMove = (e: React.TouchEvent) => {
        // 여기서는 단순 드래그 감지로 처리 (세부 드래그 효과는 생략)
    };
    const handleBannerTouchEnd = (e: React.TouchEvent) => {
        if (bannerTouchStartRef.current !== null) {
            const diff = e.changedTouches[0].clientX - bannerTouchStartRef.current;
            if (diff > 50) {
                goToPrevBanner();
            } else if (diff < -50) {
                goToNextBanner();
            }
        }
        // 터치가 끝나면 타이머 재시작
        startTimeRef.current = Date.now();
        // 프로그래스 바 타이머 재시작
        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const percentage = Math.min(100, (elapsed / AUTO_ADVANCE_DELAY) * 100);
            setProgress(percentage);
            if (percentage >= 100) {
                goToNextBanner();
            }
        }, PROGRESS_UPDATE_INTERVAL);
        bannerTouchStartRef.current = null;
    };

    // =============================
    // 렌더링
    // =============================
    return (
        <div>
            {mode === "list" && (
                <>
                    {imageArray.length === 1 ? (
                        // 단일 이미지의 경우
                        <div className="w-full h-full flex items-center justify-center">
                            <Image
                                src={imageArray[0]}
                                alt="Single Image"
                                layout="responsive"
                                width={800}
                                height={600}
                                className="object-cover rounded-lg"
                                onClick={() => openModal(0)}
                            />
                        </div>
                    ) : (
                        // 여러 이미지일 경우 썸네일 리스트
                        <div className="flex overflow-x-auto space-x-2 p-2 bg-gray-200 rounded">
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
                    )}
                </>
            )}

            {mode === "banner" && (
                <div
                    className="relative w-full h-[400px] bg-black overflow-hidden"
                    onTouchStart={handleBannerTouchStart}
                    onTouchMove={handleBannerTouchMove}
                    onTouchEnd={handleBannerTouchEnd}
                >
                    {/* 이미지 */}
                    <div
                        className="w-full h-full flex transition-transform duration-300"
                        style={{
                            transform: `translateX(-${bannerIndex * 100}%)`,
                        }}
                    >
                        {imageArray.map((imgUrl, index) => (
                            <div key={index} className="w-full flex-shrink-0 relative">
                                <Image
                                    src={imgUrl}
                                    alt={`Banner Image ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* 좌우 화살표 */}
                    <button
                        onClick={goToPrevBanner}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white"
                    >
                        <FaChevronLeft size={20} />
                    </button>
                    <button
                        onClick={goToNextBanner}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white"
                    >
                        <FaChevronRight size={20} />
                    </button>

                    {/* 프로그래스 바 */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="w-full h-1 bg-gray-500 rounded">
                            <div
                                className="h-1 bg-white rounded"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* 이미지 인디케이터 (동그라미) */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
                        {imageArray.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                    index === bannerIndex ? "bg-white" : "bg-gray-600"
                                }`}
                            ></div>
                        ))}
                    </div>
                </div>
            )}

            {/* 확대 모달 (list 모드에서 이미지 클릭 시) */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative border-4 border-white bg-gray-400"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            cursor: dragging ? "grabbing" : "grab",
                            overflow: "hidden",
                            touchAction: "none",
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
                            className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 z-50"
                            style={{ cursor: "pointer" }}
                        >
                            <IoClose size={24} />
                        </button>

                        {/* 좌우 화살표 */}
                        {imageArray.length > 1 && (
                            <>
                                <button
                                    onClick={() => {
                                        if (modalIndex > 0) {
                                            setModalIndex(modalIndex - 1);
                                            resetZoom();
                                        }
                                    }}
                                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 ${
                                        modalIndex === 0
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                    }`}
                                    disabled={modalIndex === 0}
                                    style={{ zIndex: 100 }}
                                >
                                    <FaChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (modalIndex < imageArray.length - 1) {
                                            setModalIndex(modalIndex + 1);
                                            resetZoom();
                                        }
                                    }}
                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-3 ${
                                        modalIndex === imageArray.length - 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                    }`}
                                    disabled={modalIndex === imageArray.length - 1}
                                    style={{ zIndex: 100 }}
                                >
                                    <FaChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {/* 확대된 이미지 */}
                        <div
                            style={{
                                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                                transformOrigin: "center",
                                transition: dragging ? "none" : "transform 0.3s ease",
                            }}
                        >
                            <Image
                                src={imageArray[modalIndex]}
                                alt={`Image ${modalIndex + 1}`}
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
