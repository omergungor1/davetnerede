"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, Maximize } from 'lucide-react';

export function ImageGallery({ images, alt, height = "h-52", link, objectFit = "object-cover", showArrows = true, allowFullScreen = true }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const [isMobile, setIsMobile] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

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

    // Lightbox için ESC tuşunu dinle
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && lightboxOpen) {
                closeLightbox();
            } else if (e.key === 'ArrowLeft' && lightboxOpen) {
                prevLightboxImage();
            } else if (e.key === 'ArrowRight' && lightboxOpen) {
                nextLightboxImage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightboxOpen, lightboxIndex]);

    // Lightbox açıldığında scroll'u engelle
    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [lightboxOpen]);

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
        if (imageArray.length > 1) {
            touchStartX.current = e.touches[0].clientX;
            // Yatay kaydırma olayının sayfayı etkilememesi için
            e.stopPropagation();
        }
    };

    const handleTouchMove = (e) => {
        if (imageArray.length > 1) {
            // Sayfanın yatay kaydırılmasını engelle
            e.preventDefault();
        }
    };

    const handleTouchEnd = (e) => {
        if (imageArray.length > 1) {
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

    // Lightbox işlevleri
    const openLightbox = (index, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextLightboxImage = () => {
        setLightboxIndex((prev) => (prev + 1) % imageArray.length);
    };

    const prevLightboxImage = () => {
        setLightboxIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
    };

    const ImageContent = () => (
        <div
            className="relative overflow-hidden rounded-md"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Kaydırılabilir galeri - hem mobil hem masaüstü */}
            <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${activeImageIndex * 100}%)` }}
            >
                {imageArray.map((image, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-full relative"
                    >
                        <img
                            src={image}
                            alt={`${alt} - ${index + 1}`}
                            className={`w-full ${height} ${objectFit} ${allowFullScreen ? 'cursor-pointer' : ''}`}
                            draggable="false"
                            onClick={(e) => allowFullScreen && openLightbox(index, e)}
                        />
                        {/* Tam ekran butonu */}
                        {allowFullScreen && <button
                            className="absolute top-2 right-2 bg-black/40 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-opacity"
                            onClick={(e) => openLightbox(index, e)}
                            aria-label="Tam ekran görüntüle"
                        >
                            <Maximize size={16} />
                        </button>}
                    </div>
                ))}
            </div>

            {/* Navigasyon butonları - birden fazla resim varsa ve showArrows true ise */}
            {imageArray.length > 1 && showArrows && (
                <>
                    <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-md text-primary hover:bg-white/90 z-10"
                        onClick={prevImage}
                        aria-label="Önceki resim"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-md text-primary hover:bg-white/90 z-10"
                        onClick={nextImage}
                        aria-label="Sonraki resim"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </>
            )}

            {/* Gösterge noktaları */}
            {showArrows && imageArray.length > 1 && (
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
            )}
        </div>
    );

    // Lightbox Bileşeni
    const Lightbox = () => (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <button
                className="absolute top-4 right-4 text-white p-4 hover:bg-white/10 rounded-full z-10"
                onClick={closeLightbox}
                aria-label="Kapat"
            >
                <X size={24} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
                <img
                    src={imageArray[lightboxIndex]}
                    alt={`${alt} - ${lightboxIndex + 1}`}
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                />

                {imageArray.length > 1 && (
                    <>
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full text-white hover:bg-white/20"
                            onClick={prevLightboxImage}
                            aria-label="Önceki resim"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full text-white hover:bg-white/20"
                            onClick={nextLightboxImage}
                            aria-label="Sonraki resim"
                        >
                            <ChevronRight size={28} />
                        </button>

                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {imageArray.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-colors ${index === lightboxIndex ? 'bg-white' : 'bg-white/30'}`}
                                    onClick={() => setLightboxIndex(index)}
                                    aria-label={`${index + 1}. resim`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Ana galeri */}
            {link ? (
                <Link href={link} className="block group">
                    <ImageContent />
                </Link>
            ) : (
                <div className="group">
                    <ImageContent />
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && <Lightbox />}
        </>
    );
} 