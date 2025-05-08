"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Modal } from './ui/modal';
import { RequestQuoteForm } from './request-quote-form';
import { ImageGallery } from './ui/image-gallery';

export function VenueCard({ venue }) {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Mobil görünümü kontrol et
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    // Eğer images özelliği yoksa veya boşsa, image özelliğini kullan
    const images = venue.images && venue.images.length > 0
        ? venue.images
        : venue.image ? [venue.image] : ['/images/placeholder.jpg'];

    const openQuoteModal = (e) => {
        e.preventDefault();
        setIsQuoteModalOpen(true);
    };

    const handleQuoteSuccess = () => {
        setQuoteSubmitted(true);
        setTimeout(() => {
            setIsQuoteModalOpen(false);
            setTimeout(() => {
                setQuoteSubmitted(false);
            }, 500);
        }, 2000);
    };

    return (
        <>
            <div className="border border-border rounded-lg overflow-hidden bg-white mb-6 h-full">
                <div className="relative">
                    <ImageGallery
                        images={images}
                        alt={venue.name}
                        height="h-52"
                        link={`/dugun-mekanlari/${venue.id}`}
                    />

                    {venue.discount && (
                        <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                            {venue.discount}
                        </div>
                    )}

                    <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
                        <Heart className="h-5 w-5 text-primary" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <Link href={`/dugun-mekanlari/${venue.id}`} className="group">
                            <h3 className="font-semibold text-text group-hover:text-primary">{venue.name}</h3>
                        </Link>

                        {venue.rating && (
                            <div className="flex items-center">
                                <span className="text-xs text-darkgray mr-1">{venue.rating}</span>
                                <span className="text-primary">★</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center text-xs text-darkgray mb-3">
                        {venue.location && <span className="mr-2">{venue.location}</span>}
                        {venue.capacity && (
                            <>
                                <span className="mx-1">•</span>
                                <span>{venue.capacity}</span>
                            </>
                        )}
                        {venue.capacity_range && (
                            <>
                                <span className="mx-1">•</span>
                                <span>{venue.capacity_range}</span>
                            </>
                        )}
                    </div>

                    <div className="text-xs text-darkgray mb-4">
                        {venue.features?.map((feature, index) => (
                            <span key={index}>
                                {index > 0 && <span className="mx-1">•</span>}
                                {feature}
                            </span>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            {venue.price_label && <span className="text-xs text-darkgray">{venue.price_label}</span>}
                            {venue.base_price && (
                                <div className="font-semibold text-text">
                                    {venue.base_price} TL
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={openQuoteModal}
                                className="bg-white border border-primary text-primary text-sm rounded px-3 py-1 hover:bg-primary hover:text-white transition-colors"
                            >
                                Teklif Al
                            </button>
                            <Link href={`/dugun-mekanlari/${venue.id}`} className="bg-primary text-white text-sm rounded px-3 py-1 hover:bg-primary/90 transition-colors">
                                İncele
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                title={quoteSubmitted ? "Teşekkürler!" : "Ücretsiz Teklif Alın"}
            >
                {quoteSubmitted ? (
                    <div className="py-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Talebiniz Alındı!</h3>
                        <p className="text-sm text-gray-500">
                            Teklif talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.
                        </p>
                    </div>
                ) : (
                    <RequestQuoteForm
                        venueName={venue.name}
                        onSuccess={handleQuoteSuccess}
                        onClose={() => setIsQuoteModalOpen(false)}
                    />
                )}
            </Modal>
        </>
    );
} 