"use client";

import Link from 'next/link';
import { Heart } from 'lucide-react';

export function VenueCard({ venue }) {
    return (
        <div className="border border-border rounded-lg overflow-hidden bg-white mb-6 h-full">
            <div className="relative">
                <Link href={`/dugun-mekanlari/${venue.id}`}>
                    <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-52 object-cover"
                    />
                </Link>

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
                        <Link href={`/dugun-mekanlari/${venue.id}#teklif`} className="bg-white border border-primary text-primary text-sm rounded px-3 py-1 hover:bg-primary hover:text-white transition-colors">
                            Teklif Al
                        </Link>
                        <Link href={`/dugun-mekanlari/${venue.id}`} className="bg-primary text-white text-sm rounded px-3 py-1 hover:bg-primary/90 transition-colors">
                            İncele
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 