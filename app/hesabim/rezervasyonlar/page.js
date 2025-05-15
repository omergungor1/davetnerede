"use client";

import { useState, useEffect } from 'react';
import { AccountLayout } from '@/components/account/account-layout';
import { useAuth } from '@/app/context/auth-context';
import { Loader2, AlertCircle, Check, X, Clock, User, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RezervasyonlarPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [rezervasyonlar, setRezervasyonlar] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchRezervasyonlar();
        }
    }, [user]);

    // Örnek veri - Gerçekte API'den getirilecek
    const fetchRezervasyonlar = async () => {
        setLoading(true);
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/rezervasyonlar?userId=${user.id}`);
            // const result = await response.json();

            // Örnek veri
            setTimeout(() => {
                const mockData = [
                    {
                        id: 1,
                        firma_adi: 'Hayal Düğün Salonu',
                        etkinlik_turu: 'Düğün',
                        tarih: '15.06.2024',
                        saat: '19:00 - 23:00',
                        kisi_sayisi: 150,
                        fiyat: '15.000 TL',
                        durum: 'onaylandi',
                        odeme_durumu: 'Kapora Ödendi',
                        adres: 'Atatürk Cad. No:123, Çankaya/Ankara',
                        detay: 'Düğün paketi - Yemek, dekorasyon ve müzik dahil'
                    },
                    {
                        id: 2,
                        firma_adi: 'Elit Organizasyon',
                        etkinlik_turu: 'Kına Gecesi',
                        tarih: '14.06.2024',
                        saat: '20:00 - 00:00',
                        kisi_sayisi: 100,
                        fiyat: '8.000 TL',
                        durum: 'beklemede',
                        odeme_durumu: 'Ödeme Bekleniyor',
                        adres: 'Bağdat Cad. No:55, Kadıköy/İstanbul',
                        detay: 'Kına gecesi organizasyonu - Kına malzemeleri, DJ ve ikramlar dahil'
                    },
                    {
                        id: 3,
                        firma_adi: 'Mavi Deniz Otel',
                        etkinlik_turu: 'Nişan',
                        tarih: '10.05.2024',
                        saat: '16:00 - 20:00',
                        kisi_sayisi: 80,
                        fiyat: '12.000 TL',
                        durum: 'iptal',
                        odeme_durumu: 'İptal Edildi',
                        adres: 'Sahil Yolu No:12, Bodrum/Muğla',
                        detay: 'Sahil manzaralı teras - Kokteyl organizasyonu'
                    }
                ];

                setRezervasyonlar(mockData);
                setLoading(false);
            }, 1000);

        } catch (err) {
            setError('Rezervasyonlar yüklenirken bir hata oluştu.');
            setLoading(false);
        }
    };

    const getStatusBadge = (durum) => {
        switch (durum) {
            case 'onaylandi':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check size={12} className="mr-1" />
                        Onaylandı
                    </span>
                );
            case 'beklemede':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock size={12} className="mr-1" />
                        Beklemede
                    </span>
                );
            case 'iptal':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X size={12} className="mr-1" />
                        İptal Edildi
                    </span>
                );
            default:
                return null;
        }
    };

    const getPaymentStatus = (odeme) => {
        if (odeme.includes('Kapora')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {odeme}
                </span>
            );
        } else if (odeme.includes('Ödeme Bekleniyor')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {odeme}
                </span>
            );
        } else if (odeme.includes('İptal')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {odeme}
                </span>
            );
        } else {
            return odeme;
        }
    };

    return (
        <AccountLayout title="Rezervasyonlarım">
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-start mb-6">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            ) : rezervasyonlar.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">Henüz bir rezervasyonunuz bulunmuyor.</div>
                    <Link href="/firmalar" passHref>
                        <Button>Firma Rehberine Göz Atın</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {rezervasyonlar.map((rezervasyon) => (
                        <div
                            key={rezervasyon.id}
                            className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="text-lg font-medium text-gray-900 mr-2">
                                            {rezervasyon.firma_adi}
                                        </h3>
                                        <span className="text-primary font-medium text-sm">
                                            {rezervasyon.etkinlik_turu}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {getStatusBadge(rezervasyon.durum)}
                                        {getPaymentStatus(rezervasyon.odeme_durumu)}
                                    </div>
                                </div>
                                <div className="mt-3 md:mt-0">
                                    <span className="font-semibold text-lg text-primary">
                                        {rezervasyon.fiyat}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center">
                                    <Calendar size={16} className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Tarih</p>
                                        <p>{rezervasyon.tarih}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Clock size={16} className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Saat</p>
                                        <p>{rezervasyon.saat}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Users size={16} className="text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Kişi Sayısı</p>
                                        <p>{rezervasyon.kisi_sayisi} Kişi</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Adres</p>
                                <p>{rezervasyon.adres}</p>
                            </div>

                            {rezervasyon.detay && (
                                <div className="p-3 bg-gray-50 rounded-md mb-4">
                                    <p className="text-sm text-gray-500">Detaylar:</p>
                                    <p className="text-sm">{rezervasyon.detay}</p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mt-4">
                                <Button variant="outline" size="sm">
                                    Detayları Görüntüle
                                </Button>

                                {rezervasyon.durum === 'onaylandi' && (
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(rezervasyon.adres)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline" size="sm">
                                            Yol Tarifi Al
                                        </Button>
                                    </a>
                                )}

                                {rezervasyon.durum === 'beklemede' && (
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                                        İptal Et
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AccountLayout>
    );
} 