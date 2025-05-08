"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { VenueCard } from '../../components/venue-card';

const venues = [
    {
        id: 1,
        name: 'Mövenpick Hotel İstanbul Asia Airport',
        image: '/images/mekan-1.webp',
        images: [
            '/images/salon-6.webp',
            '/images/mekan-2.webp',
            '/images/mekan-3.jpeg',
        ],
        rating: '5.0',
        reviewCount: '(45)',
        location: 'Pendik',
        capacity: '50 - 1000',
        features: ['Modern ve filitresiz', 'Menü tadımı', 'Giriş dans pisti', 'Jimmy Jib', 'Sahne ışık sistemi', 'Geniş otopark', '5 yıldızlı otel'],
        price_label: 'Kişi Başı',
        base_price: '1.350',
        discount: '%25'
    },
    {
        id: 2,
        name: 'Casamento',
        image: '/images/salon-2.webp',
        images: [
            '/images/salon-2.webp',
            '/images/salon-6.webp',
            '/images/salon-9.jpg'
        ],
        rating: '5.0',
        reviewCount: '(31)',
        location: 'Sarıyer',
        capacity_range: '100 - 350',
        features: ['Boğaz manzarası', 'Havuz başında', 'Modern ve sade', 'Fotoğraf çekim alanı', 'Menü tadımı', 'DJ', 'Sahne ışık sistemi', 'Geniş otopark'],
        price_label: 'Yemekli Kişi Başı',
        base_price: '3.500',
        discount: 'Hediye'
    },
    {
        id: 3,
        name: 'Plus Hotel',
        image: '/images/salon-4.webp',
        images: [
            '/images/salon-4.webp',
            '/images/salon-10.jpg',
            '/images/salon-12.jpg',
            '/images/salon-15.jpg'
        ],
        rating: '5.0',
        reviewCount: '(111)',
        features: ['Butik düğüne uygun', 'Gün ışığı alan', 'DJ', 'Büyük gelin odası', 'Alkol servisi yok', 'Kolay ulaşım', 'Nişan süslemesi', 'Nişan tepsisi'],
        price_label: 'Paket',
        base_price: '65.000',
        discount: '%22'
    },
    {
        id: 4,
        name: 'May Otel',
        image: '/images/salon-5.webp',
        images: [
            '/images/salon-5.webp',
            '/images/salon-11.jpg',
            '/images/salon-14.jpg'
        ],
        rating: '4.9',
        reviewCount: '(11)',
        capacity_range: '10 - 95',
        features: ['Boğaz manzarası', 'Modern ve sade', 'Cam salon', 'Fotoğraf çekim alanı', 'Alkol servisi yok', 'Balkon / Teras alanı', 'Kolay ulaşım', 'Nişan süslemesi'],
        price_label: 'Kişi Başı',
        base_price: '900',
        discount: '%16'
    },
    {
        id: 5,
        name: 'Gopark Event',
        image: '/images/salon-6.webp',
        images: [
            '/images/salon-6.webp',
            '/images/salon-16.jpg',
            '/images/salon-1.webp',
            '/images/salon-2.webp'
        ],
        rating: '5.0',
        reviewCount: '(112)',
        location: 'Gaziosmanpaşa',
        features: ['Modern ve filtresiz', 'Yüksek tavan', 'Kolonssuz', 'Fotoğraf çekim alanı', 'Geniş dans pisti', 'Canlı müzik', 'DJ', 'Sahne ışık sistemi', 'Alkol servisi var'],
        price_label: 'Yemekli Kişi Başı',
        base_price: '500'
    }
];

export default function DugunMekanlari() {
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const handleResize = () => {
            setFiltersVisible(window.innerWidth >= 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    const activeFilterCount = 7;

    return (
        <Layout>
            <div className="bg-background min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Mobil Filtre Toggle Butonu */}
                    <div className="md:hidden mb-4">
                        <button
                            onClick={toggleFilters}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border ${filtersVisible ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-border text-text'} font-medium transition-colors`}
                        >
                            <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 text-primary`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                {filtersVisible ? 'Filtreleri Gizle' : 'Filtreler'}
                            </span>
                            <span className="flex items-center">
                                <span className="text-xs mr-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 transition-transform ${filtersVisible ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sol Filtreler */}
                        <div className={`w-full md:w-1/4 lg:w-1/5 transition-all duration-300 ${isClient ? (filtersVisible ? 'block' : 'hidden md:block') : 'hidden md:block'}`}>
                            <div className="bg-white rounded-lg border border-border p-4 mb-4 shadow-sm">
                                <div className="mb-4">
                                    <label className="block text-sm text-darkgray mb-2">Söz, Nişan Mekanları</label>
                                    <div className="relative">
                                        <select className="w-full border border-border rounded-md py-2 px-3 bg-white text-text focus:outline-none focus:border-primary">
                                            <option>İstanbul</option>
                                            <option>Ankara</option>
                                            <option>İzmir</option>
                                            <option>Bursa</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-4 mb-4">
                                    <h3 className="font-medium text-text mb-2">Bölge</h3>
                                    <ul className="text-sm">
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Avrupa Yakası</span>
                                                <span className="text-xs text-darkgray">(240)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Anadolu Yakası</span>
                                                <span className="text-xs text-darkgray">(116)</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t border-border pt-4 mb-4">
                                    <h3 className="font-medium text-text mb-2">İlçe</h3>
                                    <ul className="text-sm">
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Üsküdar</span>
                                                <span className="text-xs text-darkgray">(35)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Sarıyer</span>
                                                <span className="text-xs text-darkgray">(48)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Beykoz</span>
                                                <span className="text-xs text-darkgray">(26)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Pendik</span>
                                                <span className="text-xs text-darkgray">(19)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Bakırköy</span>
                                                <span className="text-xs text-darkgray">(12)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Ümraniye</span>
                                                <span className="text-xs text-darkgray">(8)</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t border-border pt-4 mb-4">
                                    <h3 className="font-medium text-text mb-2">Fiyat</h3>
                                    <ul className="text-sm">
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>0TL - 300TL</span>
                                                <span className="text-xs text-darkgray">(27)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>300TL - 600TL</span>
                                                <span className="text-xs text-darkgray">(43)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>600TL - 900TL</span>
                                                <span className="text-xs text-darkgray">(38)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>900TL - 1200TL</span>
                                                <span className="text-xs text-darkgray">(24)</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t border-border pt-4 mb-4">
                                    <h3 className="font-medium text-text mb-2">Davetli Sayısı</h3>
                                    <ul className="text-sm">
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>0 - 100 kişi</span>
                                                <span className="text-xs text-darkgray">(56)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>100 - 300 kişi</span>
                                                <span className="text-xs text-darkgray">(124)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>300 - 500 kişi</span>
                                                <span className="text-xs text-darkgray">(87)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>500 - 1000 kişi</span>
                                                <span className="text-xs text-darkgray">(32)</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t border-border pt-4 mb-4">
                                    <h3 className="font-medium text-text mb-2">Mekan Özellikleri</h3>
                                    <ul className="text-sm">
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Manzara</span>
                                                <span className="text-xs text-darkgray">(67)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Açık Alan</span>
                                                <span className="text-xs text-darkgray">(93)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Kapalı Alan</span>
                                                <span className="text-xs text-darkgray">(142)</span>
                                            </a>
                                        </li>
                                        <li className="mb-2">
                                            <a href="#" className="text-darkgray hover:text-primary flex items-center justify-between">
                                                <span>Otel</span>
                                                <span className="text-xs text-darkgray">(29)</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="border-t border-border pt-4">
                                    <h3 className="font-medium text-text mb-2">Kampanyalı Firmalar</h3>
                                    <div className="relative">
                                        <label className="flex items-center text-sm text-darkgray cursor-pointer">
                                            <input type="checkbox" className="form-checkbox h-4 w-4 text-primary border-darkgray rounded focus:ring-primary" />
                                            <span className="ml-2">Kampanyalı Firmaları Göster</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sağ İçerik */}
                        <div className="w-full md:w-3/4 lg:w-4/5">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-text text-sm">356 adet nişan mekanları bulundu.</h1>

                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <select className="appearance-none bg-white border border-border rounded-md py-2 pl-3 pr-8 text-sm text-text focus:outline-none focus:border-primary">
                                            <option>Sırala</option>
                                            <option>Popülerlik</option>
                                            <option>Fiyat: Artan</option>
                                            <option>Fiyat: Azalan</option>
                                            <option>Puan</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="h-4 w-4 text-darkgray" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button className="p-2 text-primary border border-border rounded-md hover:bg-lightgray">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M8 6h13"></path>
                                                <path d="M8 12h13"></path>
                                                <path d="M8 18h13"></path>
                                                <path d="M3 6h.01"></path>
                                                <path d="M3 12h.01"></path>
                                                <path d="M3 18h.01"></path>
                                            </svg>
                                        </button>

                                        <button className="p-2 bg-lightgray text-darkgray border border-border rounded-md hover:bg-gray-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="7" height="7"></rect>
                                                <rect x="14" y="3" width="7" height="7"></rect>
                                                <rect x="14" y="14" width="7" height="7"></rect>
                                                <rect x="3" y="14" width="7" height="7"></rect>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mekan Kartları */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                                {venues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                            </div>

                            {/* Sayfalama */}
                            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                                <button className="flex items-center text-sm text-darkgray bg-white border border-border rounded-md px-3 py-2 hover:bg-lightgray">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 sm:mr-2">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                    <span className="hidden xs:inline">Önceki</span>
                                </button>

                                <div className="flex items-center space-x-1 mx-auto">
                                    <span className="inline-flex items-center justify-center min-w-[28px] sm:min-w-[32px] h-8 text-sm bg-primary text-white rounded-md">1</span>
                                    <span className="inline-flex items-center justify-center min-w-[28px] sm:min-w-[32px] h-8 text-sm text-darkgray hover:bg-lightgray rounded-md">2</span>
                                    <span className="inline-flex items-center justify-center min-w-[28px] sm:min-w-[32px] h-8 text-sm text-darkgray hover:bg-lightgray rounded-md">3</span>
                                    <span className="hidden sm:inline-flex items-center justify-center h-8 px-2 text-sm text-darkgray">...</span>
                                    <span className="hidden sm:inline-flex items-center justify-center min-w-[32px] h-8 text-sm text-darkgray hover:bg-lightgray rounded-md">7</span>
                                    <span className="hidden sm:inline-flex items-center justify-center min-w-[32px] h-8 text-sm text-darkgray hover:bg-lightgray rounded-md">8</span>
                                    <span className="hidden sm:inline-flex items-center justify-center min-w-[32px] h-8 text-sm text-darkgray hover:bg-lightgray rounded-md">9</span>
                                </div>

                                <button className="flex items-center text-sm text-darkgray bg-white border border-border rounded-md px-3 py-2 hover:bg-lightgray">
                                    <span className="hidden xs:inline">Sonraki</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 sm:ml-2">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>

                            {/* Fiyat Tablosu */}
                            <div className="mt-16 bg-white border border-border rounded-lg overflow-hidden">
                                <div className="px-4 py-3 bg-lightgray border-b border-border">
                                    <h2 className="text-text font-medium">İstanbul Söz, Nişan Mekanları Fiyatları</h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-border">
                                        <thead>
                                            <tr className="bg-lightgray">
                                                <th className="px-4 py-2 text-left text-xs font-medium text-darkgray uppercase tracking-wider">İlçe</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-darkgray uppercase tracking-wider">Kapasite</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-darkgray uppercase tracking-wider">Kişi Başı Fiyat</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-darkgray uppercase tracking-wider">Düğün Fiyatı</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-border">
                                            <tr>
                                                <td className="px-4 py-2 text-sm text-text">Üsküdar</td>
                                                <td className="px-4 py-2 text-sm text-text">150</td>
                                                <td className="px-4 py-2 text-sm text-text">1300 TL</td>
                                                <td className="px-4 py-2 text-sm text-text">195.000 TL</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 text-sm text-text">Sarıyer</td>
                                                <td className="px-4 py-2 text-sm text-text">350</td>
                                                <td className="px-4 py-2 text-sm text-text">1150 TL</td>
                                                <td className="px-4 py-2 text-sm text-text">402.500 TL</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 text-sm text-text">Beykoz</td>
                                                <td className="px-4 py-2 text-sm text-text">350</td>
                                                <td className="px-4 py-2 text-sm text-text">1000 TL</td>
                                                <td className="px-4 py-2 text-sm text-text">350.000 TL</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 text-sm text-text">Pendik</td>
                                                <td className="px-4 py-2 text-sm text-text">200</td>
                                                <td className="px-4 py-2 text-sm text-text">700 TL</td>
                                                <td className="px-4 py-2 text-sm text-text">140.000 TL</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 text-sm text-text">Bakırköy</td>
                                                <td className="px-4 py-2 text-sm text-text">100</td>
                                                <td className="px-4 py-2 text-sm text-text">1050 TL</td>
                                                <td className="px-4 py-2 text-sm text-text">105.000 TL</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 text-sm text-text">Ümraniye</td>
                                                <td className="px-4 py-2 text-sm text-text">250</td>
                                                <td className="px-4 py-2 text-sm text-text">350 TL</td>
                                                <td className="px-4 py-2 text-sm text-text">87.500 TL</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 