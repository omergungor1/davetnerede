"use client";

import { useState } from 'react';
import { AccountLayout } from '@/components/account/account-layout';
import { VenueCard } from '@/components/venue-card';

// Mock veri
const mockFavorites = [
    {
        id: 1,
        name: "Elysium Düğün Salonu",
        slug: "elysium-dugun-salonu",
        district_name: "Kadıköy",
        capacity: 500,
        features: ["Açık Alan", "Kapalı Alan", "Havuz Başı"],
        images: ["/images/salon-1.webp", "/images/salon-2.webp"],
        packages: [
            {
                id: 1,
                price: 15000,
                is_per_person: true,
                isDeleted: false
            }
        ],
        rating: 4.5
    },
    {
        id: 2,
        name: "Crystal Garden",
        slug: "crystal-garden",
        district_name: "Beşiktaş",
        capacity: 300,
        features: ["Teras", "Deniz Manzarası", "VIP Salon"],
        images: ["/images/salon-6.webp", "/images/salon-4.webp"],
        packages: [
            {
                id: 1,
                price: 25000,
                is_per_person: false,
                isDeleted: false
            }
        ],
        rating: 4.8
    }
];

export default function FavoritesPage() {
    const [favorites] = useState(mockFavorites);

    return (
        <AccountLayout>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Favori Mekanlarım</h2>
                {favorites.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Henüz favori mekanınız bulunmuyor.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} isSmall={true} />
                        ))}
                    </div>
                )}
            </div>
        </AccountLayout>
    );
} 