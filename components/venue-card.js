"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Modal } from './ui/modal';
import { RequestQuoteForm } from './request-quote-form';
import { ImageGallery } from './ui/image-gallery';
import { QuoteModal } from './quote/quote-modal';

export function VenueCard({ venue, isSmall = false }) {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const getLowestActivePackage = (packages) => {
        if (!packages || packages.length === 0) return null;

        const activePackages = packages.filter(pkg => !pkg.isDeleted);
        if (activePackages.length === 0) return null;

        return activePackages.reduce((min, current) =>
            current.price < min.price ? current : min, activePackages[0]);
    };

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
                        link={`/davet-salonu/${venue.slug}`}
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
                        <Link href={`/davet-salonu/${venue.slug}`} className="group">
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
                        {venue.district_name && <span className="mr-2">{venue.district_name}</span>}
                        {venue.capacity && (
                            <>
                                <span className="mx-1">•</span>
                                <span>{venue.capacity} kişi</span>
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
                    {/* <div className="text-xs text-darkgray mb-4">
                        {venue.services?.map((service, index) => (
                            <span key={index}>
                                {index > 0 && <span className="mx-1">•</span>}
                                {service}
                            </span>
                        ))}
                    </div> */}

                    <div className={`mt-4 flex ${isSmall ? 'flex-col' : ' flex-col md:flex-row'} ${isSmall ? 'items-start' : 'items-start md:items-center'} ${isSmall ? 'justify-start' : 'justify-start md:justify-between'} ${isSmall ? 'gap-2' : 'gap-2 md:gap-0'}`}>
                        <div>
                            {(() => {
                                const lowestPackage = getLowestActivePackage(venue.packages);
                                if (!lowestPackage) return null;

                                return (
                                    <>
                                        <span className="text-xs text-darkgray">
                                            {lowestPackage.is_per_person ? 'Kişi Başı' : 'Paket'}
                                        </span>
                                        <div className="font-semibold text-text flex items-center gap-2">
                                            {lowestPackage.price.toLocaleString('tr-TR')} ₺
                                            <span className="text-xs text-darkgray">'den başlayan fiyatlarla</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={openQuoteModal}
                                className="bg-white border border-primary text-primary text-sm rounded px-3 py-1 hover:bg-primary hover:text-white transition-colors"
                            >
                                Teklif Al
                            </button>
                            {console.log(venue)}
                            <Link href={`/davet-salonu/${venue.slug}`} className="bg-primary text-white text-sm rounded px-3 py-1 hover:bg-primary/90 transition-colors">
                                İncele
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <QuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                venue={venue}
            />
        </>
    );
} 