"use client";

import { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function QuoteModal({ isOpen, onClose, venue }) {
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);
    const [date, setDate] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [sharePhone, setSharePhone] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    // Bugünün tarihini YYYY-MM-DD formatında al
    const today = new Date().toISOString().split('T')[0];

    // Aktif paketleri filtrele
    const activePackages = venue.packages?.filter(pkg => !pkg.isdeleted) || [];

    // Modal açıldığında ve tek paket varsa onu seç
    useEffect(() => {
        if (isOpen && activePackages.length === 1) {
            setSelectedPackage(activePackages[0].id);
        }
    }, [isOpen, activePackages]);

    // Modal kapanınca tüm state'leri sıfırla
    const handleClose = () => {
        setQuoteSubmitted(false);
        setDate('');
        setGuestCount('');
        setSharePhone(false);
        setSelectedPackage(null);
        setIsLoading(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Teklif göndermek için giriş yapmalısınız');
            handleClose();
            return;
        }

        if (!date || !guestCount) {
            toast.error('Lütfen tarih ve davetli sayısını giriniz');
            return;
        }

        if (activePackages.length > 0 && !selectedPackage) {
            toast.error('Lütfen bir paket seçiniz');
            return;
        }

        setIsLoading(true);

        try {
            // API çağrısı simülasyonu
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setQuoteSubmitted(true);
            toast.success('Teklif talebiniz başarıyla gönderildi');

            // Gerçek API çağrısı için hazır kod:
            // const response = await fetch('/api/quotes', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         venueId: venue.id,
            //         userId: user.id,
            //         date,
            //         guestCount: parseInt(guestCount),
            //         sharePhone,
            //         packageId: selectedPackage
            //     }),
            // });

            // if (!response.ok) {
            //     throw new Error('Teklif gönderilirken bir hata oluştu');
            // }
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message);
        }
    };

    const isFormValid = date && guestCount && (activePackages.length === 0 || selectedPackage !== null);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={quoteSubmitted ? "Teşekkürler!" : "Ücretsiz Teklif Alın"}
        >
            {console.log(venue.packages)}
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <p className="text-lg font-semibold text-primary">{venue.name}</p>
                        <p className="text-sm text-gray-600">{venue.district_name}</p>
                    </div>

                    {activePackages?.length > 0 && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Paket Seçimi*
                            </label>
                            <div className="space-y-3">
                                {activePackages?.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        className="relative flex items-start p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedPackage(pkg.id)}
                                    >
                                        <div className="flex items-center h-5">
                                            <input
                                                type="radio"
                                                name="package"
                                                value={pkg.id}
                                                checked={selectedPackage === pkg.id}
                                                onChange={() => setSelectedPackage(pkg.id)}
                                                className="h-4 w-4 text-primary border-gray-300 cursor-pointer"
                                                required
                                            />
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <label className="text-sm font-medium text-gray-900 cursor-pointer">
                                                {pkg.name}
                                            </label>
                                            <p className="text-sm text-gray-500">{pkg.description}</p>
                                            <div className="mt-1 flex flex-col md:flex-row items-start md:items-center text-sm text-gray-700">
                                                <div>
                                                    <span className="font-medium">{pkg.price} ₺</span>
                                                    <span className="ml-1">'den başlayan fiyatlarla</span>
                                                    {pkg.is_per_person && (
                                                        <span className="ml-1">/ Kişi Başı</span>
                                                    )}
                                                </div>
                                                {pkg.capacity && (
                                                    <span className="ml-0 md:ml-2 text-gray-500">
                                                        (Maks. {pkg.capacity} kişi)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Organizasyon Tarihi*
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={date}
                            min={today}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                            Tahmini Davetli Sayısı*
                        </label>
                        <input
                            type="number"
                            id="guestCount"
                            value={guestCount}
                            onChange={(e) => setGuestCount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                            min="1"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="shareName"
                                checked
                                disabled
                                className="h-4 w-4 text-primary border-gray-300 rounded cursor-not-allowed"
                            />
                            <label htmlFor="shareName" className="ml-2 block text-sm text-gray-600">
                                Ad-Soyadımın bu işletme ile paylaşılmasını onaylıyorum
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="sharePhone"
                                checked={sharePhone}
                                onChange={(e) => setSharePhone(e.target.checked)}
                                className="h-4 w-4 text-primary border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="sharePhone" className="ml-2 block text-sm text-gray-600">
                                Telefonumun bu işletme ile paylaşılmasını istiyorum
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center ${isFormValid && !isLoading ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Gönderiliyor...
                                </>
                            ) : (
                                'Teklif Al'
                            )}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
} 