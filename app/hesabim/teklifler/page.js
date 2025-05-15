"use client";

import { useState, useEffect } from 'react';
import { AccountLayout } from '@/components/account/account-layout';
import { useAuth } from '@/app/context/auth-context';
import { Loader2, AlertCircle, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TekliflerPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [teklifler, setTeklifler] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchTeklifler();
        }
    }, [user]);

    // Örnek veri - Gerçekte API'den getirilecek
    const fetchTeklifler = async () => {
        setLoading(true);
        try {
            // API çağrısı yapılacak
            // const response = await fetch(`/api/teklifler?userId=${user.id}`);
            // const result = await response.json();

            // Örnek veri
            setTimeout(() => {
                const mockData = [
                    {
                        id: 1,
                        firma_adi: 'Hayal Düğün Salonu',
                        tarih: '15.06.2024',
                        fiyat: '15.000 TL',
                        durum: 'beklemede',
                        detay: 'Düğün paketi - 150 kişilik',
                        mesaj: 'Size özel hafta içi indirimimizden yararlanabilirsiniz.',
                        tarih_created: '10.01.2024'
                    },
                    {
                        id: 2,
                        firma_adi: 'Elit Organizasyon',
                        tarih: '22.07.2024',
                        fiyat: '25.000 TL',
                        durum: 'onaylandi',
                        detay: 'Düğün + Kına Gecesi Paketi',
                        mesaj: 'Teklif onayınız için teşekkürler!',
                        tarih_created: '05.01.2024'
                    },
                    {
                        id: 3,
                        firma_adi: 'Mavi Deniz Otel',
                        tarih: '10.08.2024',
                        fiyat: '35.000 TL',
                        durum: 'reddedildi',
                        detay: 'Sahil Düğünü - 200 kişilik',
                        mesaj: 'Kararınız için teşekkürler. Başka bir paket için bize ulaşabilirsiniz.',
                        tarih_created: '15.12.2023'
                    }
                ];

                setTeklifler(mockData);
                setLoading(false);
            }, 1000);

        } catch (err) {
            setError('Teklifler yüklenirken bir hata oluştu.');
            setLoading(false);
        }
    };

    const getTeklifStatusBadge = (durum) => {
        switch (durum) {
            case 'beklemede':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock size={12} className="mr-1" />
                        Beklemede
                    </span>
                );
            case 'onaylandi':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check size={12} className="mr-1" />
                        Onaylandı
                    </span>
                );
            case 'reddedildi':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X size={12} className="mr-1" />
                        Reddedildi
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <AccountLayout title="Tekliflerim">
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-start mb-6">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            ) : teklifler.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">Henüz bir teklif almadınız.</div>
                    <Link href="/firmalar" passHref>
                        <Button>Firma Rehberine Göz Atın</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {teklifler.map((teklif) => (
                        <div
                            key={teklif.id}
                            className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {teklif.firma_adi}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Alınma Tarihi: {teklif.tarih_created}
                                    </p>
                                </div>
                                <div className="flex items-center mt-2 md:mt-0">
                                    {getTeklifStatusBadge(teklif.durum)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Etkinlik Tarihi</p>
                                    <p className="font-medium">{teklif.tarih}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Fiyat</p>
                                    <p className="font-medium">{teklif.fiyat}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Detay</p>
                                <p>{teklif.detay}</p>
                            </div>

                            {teklif.mesaj && (
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-500">Firma Mesajı:</p>
                                    <p className="text-sm">{teklif.mesaj}</p>
                                </div>
                            )}

                            {teklif.durum === 'beklemede' && (
                                <div className="flex space-x-2 mt-4">
                                    <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50">
                                        Onayla
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                                        Reddet
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </AccountLayout>
    );
} 