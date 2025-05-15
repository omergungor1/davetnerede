"use client";

import { useState, useEffect } from 'react';
import { AccountLayout } from '@/components/account/account-layout';
import { useAuth } from '@/app/context/auth-context';
import { Loader2, AlertCircle, Check, Video, MapPin, Calendar, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RandevularPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [randevular, setRandevular] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchRandevular();
        }
    }, [user]);

    // Örnek veri - Gerçekte API'den getirilecek
    const fetchRandevular = async () => {
        setLoading(true);
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/randevular?userId=${user.id}`);
            // const result = await response.json();

            // Örnek veri
            setTimeout(() => {
                const mockData = [
                    {
                        id: 1,
                        firma_adi: 'Hayal Düğün Salonu',
                        tarih: '15.01.2024',
                        saat: '14:30',
                        durum: 'tamamlandi',
                        telefon: '0532 123 45 67',
                        adres: 'Atatürk Cad. No:123, Çankaya/Ankara',
                        not: 'Salon incelemesi ve detaylı fiyat görüşmesi'
                    },
                    {
                        id: 2,
                        firma_adi: 'Elit Organizasyon',
                        tarih: '22.01.2024',
                        saat: '16:00',
                        durum: 'onaylandi',
                        telefon: '0532 123 45 67',
                        adres: 'Atatürk Cad. No:123, Çankaya/Ankara',
                        not: 'Düğün organizasyonu ön görüşme'
                    },
                    {
                        id: 3,
                        firma_adi: 'Mavi Deniz Otel',
                        tarih: '05.02.2024',
                        saat: '11:00',
                        durum: 'onaylandi',
                        telefon: '0532 123 45 67',
                        adres: 'Atatürk Cad. No:123, Çankaya/Ankara',
                        not: 'Kına gecesi organizasyonu için fiyat görüşmesi'
                    }
                ];

                setRandevular(mockData);
                setLoading(false);
            }, 1000);

        } catch (err) {
            setError('Randevular yüklenirken bir hata oluştu.');
            setLoading(false);
        }
    };


    const getRandevuStatusBadge = (durum) => {
        switch (durum) {
            case 'onaylandi':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check size={12} className="mr-1" />
                        Onaylandı
                    </span>
                );
            case 'tamamlandi':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Check size={12} className="mr-1" />
                        Tamamlandı
                    </span>
                );
            default:
                return null;
        }
    };

    const isRandevuGecmis = (tarih, saat) => {
        const randevuDateStr = `${tarih.split('.').reverse().join('-')}T${saat}:00`;
        const randevuDate = new Date(randevuDateStr);
        const now = new Date();
        return randevuDate < now;
    };

    return (
        <AccountLayout title="Randevularım">
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-start mb-6">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            ) : randevular.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">Henüz bir randevunuz bulunmuyor.</div>
                    <Link href="/firmalar" passHref>
                        <Button>Firma Rehberine Göz Atın</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {randevular.map((randevu) => (
                        <div
                            key={randevu.id}
                            className={`border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow ${isRandevuGecmis(randevu.tarih, randevu.saat) && randevu.durum !== 'tamamlandi'
                                ? 'bg-red-50 border-red-200'
                                : ''
                                }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {randevu.firma_adi}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <MapPin size={12} className="mr-1" />
                                            Yerinde
                                        </span>
                                        {getRandevuStatusBadge(randevu.durum)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center">
                                    <Calendar size={16} className="text-gray-500 mr-2" />
                                    <span>{randevu.tarih}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock size={16} className="text-gray-500 mr-2" />
                                    <span>{randevu.saat}</span>
                                </div>
                            </div>

                            {randevu.adres && (
                                <div className="flex items-start mb-3">
                                    <MapPin size={16} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{randevu.adres}</span>
                                </div>
                            )}


                            {randevu.not && (
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-500">Not:</p>
                                    <p className="text-sm">{randevu.not}</p>
                                </div>
                            )}

                            <div className="flex space-x-2 mt-4">
                                {randevu.durum === 'onaylandi' && !isRandevuGecmis(randevu.tarih, randevu.saat) && (
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                                        İptal Et
                                    </Button>
                                )}

                                {randevu.telefon && (
                                    <div className="flex items-center mb-3">
                                        <a
                                            href={`tel:${randevu.telefon}`}
                                            className="text-primary hover:underline"
                                        >
                                            <Button variant="outline" className="text-primary" size="sm">
                                                <Phone size={12} className="mr-1" />
                                                {randevu.telefon}
                                            </Button>
                                        </a>
                                    </div>
                                )}

                                {randevu.adres && (
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(randevu.adres)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline" className="text-primary" size="sm">
                                            <MapPin size={12} className="mr-1" />
                                            Yol Tarifi Al
                                        </Button>
                                    </a>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AccountLayout>
    );
} 