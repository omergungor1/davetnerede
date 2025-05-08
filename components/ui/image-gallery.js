"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ImageGallery({ images, alt, height = "h-52", link, objectFit = "object-cover" }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const [isMobile, setIsMobile] = useState(false);

    // Eğer images bir string veya undefined ise, tek elemanlı bir diziye dönüştür
    const imageArray = !images || typeof images === 'string'
        ? [images || '/images/placeholder.jpg']
        : images.length > 0
            ? images
            : ['/images/placeholder.jpg'];

    // Ekran boyutunu kontrol et
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // İlk yükleme kontrolü
        handleResize();

        // Ekran boyutu değiştiğinde kontrol et
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const nextImage = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setActiveImageIndex((prev) => (prev + 1) % imageArray.length);
    };

    const prevImage = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setActiveImageIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
    };

    const handleDotClick = (index, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setActiveImageIndex(index);
    };

    const handleTouchStart = (e) => {
        // Sadece mobilde ve birden fazla resim varsa dokunma olaylarını işle
        if (isMobile && imageArray.length > 1) {
            touchStartX.current = e.touches[0].clientX;
            // Yatay kaydırma olayının sayfayı etkilememesi için
            if (imageArray.length > 1) {
                e.stopPropagation();
            }
        }
    };

    const handleTouchMove = (e) => {
        // Sadece mobilde ve birden fazla resim varsa dokunma hareketini engelle
        if (isMobile && imageArray.length > 1) {
            // Sayfanın yatay kaydırılmasını engelle
            e.preventDefault();
        }
    };

    const handleTouchEnd = (e) => {
        // Sadece mobilde ve birden fazla resim varsa dokunma olaylarını işle
        if (isMobile && imageArray.length > 1) {
            touchEndX.current = e.changedTouches[0].clientX;
            handleSwipe();
            // Yatay kaydırma olayının sayfayı etkilememesi için
            e.stopPropagation();
        }
    };

    const handleSwipe = () => {
        const swipeDistance = touchEndX.current - touchStartX.current;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance < 0) {
                // Sol kaydırma - ileri git
                nextImage();
            } else {
                // Sağ kaydırma - geri git
                prevImage();
            }
        }
    };

    const ImageContent = () => (
        <div
            className="relative overflow-hidden rounded-md"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {isMobile ? (
                // Mobil görünüm - kaydırılabilir galeri
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
                >
                    {imageArray.map((image, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full"
                        >
                            <img
                                src={image}
                                alt={`${alt} - ${index + 1}`}
                                className={`w-full ${height} ${objectFit}`}
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                // Masaüstü görünüm - sadece ilk resim
                <div className="w-full">
                    <img
                        src={imageArray[0]}
                        alt={alt}
                        className={`w-full ${height} ${objectFit} transition-transform duration-300 group-hover:scale-105`}
                        draggable="false"
                    />
                </div>
            )}

            {/* Kaydırma butonları ve göstergeler - sadece mobilde ve birden fazla resim varsa */}
            {isMobile && imageArray.length > 1 && (
                <>
                    {/* <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md text-primary hover:bg-white/90"
                        onClick={prevImage}
                        aria-label="Önceki resim"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md text-primary hover:bg-white/90"
                        onClick={nextImage}
                        aria-label="Sonraki resim"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button> */}

                    {/* Gösterge noktaları */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {imageArray.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${index === activeImageIndex ? 'bg-primary' : 'bg-white/70'}`}
                                onClick={(e) => handleDotClick(index, e)}
                                aria-label={`${index + 1}. resim`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    // Eğer link verilmişse, tıklanabilir bir öğe döndür
    if (link) {
        return (
            <Link href={link} className="block group">
                <ImageContent />
            </Link>
        );
    }

    // Link verilmemişse, sadece galerinin kendisini döndür
    return <ImageContent />;
} 