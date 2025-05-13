"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';

export function FirmalarHeader() {
    const [modalOpen, setModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firma: '',
        sehir: '',
        ilce: '',
        adSoyad: '',
        email: '',
        telefon: ''
    });
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form gönderimi işlemleri burada yapılacak
        setIsSuccess(true);
        setTimeout(() => {
            setIsSuccess(false);
            setModalOpen(false);
            setStep(1);
            setFormData({
                firma: '',
                sehir: '',
                ilce: '',
                adSoyad: '',
                email: '',
                telefon: ''
            });
        }, 3000);
    };

    const closeModal = () => {
        setModalOpen(false);
        setStep(1);
        setIsSuccess(false);
    };

    return (
        <header className="bg-white shadow-sm py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link href="/" className="flex items-center">
                        <Image src="/images/logo.png" alt="Davet Evi Bul Logo" width={36} height={36} />
                        <span className="text-lg sm:text-xl font-bold text-primary ml-2">Davet Evi Bul</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button
                            onClick={() => setModalOpen(true)}
                            variant="outline"
                            className="text-xs sm:text-sm border-primary text-primary hover:bg-primary hover:text-white px-2 sm:px-4 py-1 sm:py-2 w-28 sm:w-32 h-8 sm:h-10 flex justify-center items-center"
                        >
                            Sizi Arayalım
                        </Button>
                        <Link
                            href="/firma-giris"
                            className="text-xs sm:text-sm bg-primary text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-primary/90 transition-colors w-28 sm:w-32 h-8 sm:h-10 flex justify-center items-center"
                        >
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sizi Arayalım Modalı */}
            <Modal isOpen={modalOpen} onClose={closeModal} title={isSuccess ? "Talebiniz Alındı" : (step === 1 ? "Firma Bilgileriniz" : "İletişim Bilgileriniz")}>
                {isSuccess ? (
                    <div className="py-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Teşekkürler!</h3>
                        <p className="text-sm text-gray-500">
                            Talebiniz alınmıştır. En kısa sürede ekip arkadaşlarımız size dönüş yapacaktır.
                        </p>
                    </div>
                ) : (
                    <>
                        {step === 1 ? (
                            <form onSubmit={handleNextStep} className="py-4 space-y-4">
                                <div>
                                    <label htmlFor="firma" className="block text-sm font-medium text-text mb-1">Firma Adı</label>
                                    <input
                                        type="text"
                                        id="firma"
                                        name="firma"
                                        value={formData.firma}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sehir" className="block text-sm font-medium text-text mb-1">Şehir</label>
                                    <input
                                        type="text"
                                        id="sehir"
                                        name="sehir"
                                        value={formData.sehir}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="ilce" className="block text-sm font-medium text-text mb-1">İlçe</label>
                                    <input
                                        type="text"
                                        id="ilce"
                                        name="ilce"
                                        value={formData.ilce}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" className="w-full">
                                        Devam Et
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="py-4 space-y-4">
                                <div>
                                    <label htmlFor="adSoyad" className="block text-sm font-medium text-text mb-1">Ad Soyad</label>
                                    <input
                                        type="text"
                                        id="adSoyad"
                                        name="adSoyad"
                                        value={formData.adSoyad}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text mb-1">E-posta</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="telefon" className="block text-sm font-medium text-text mb-1">Telefon</label>
                                    <input
                                        type="tel"
                                        id="telefon"
                                        name="telefon"
                                        value={formData.telefon}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="pt-2 flex space-x-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-1/2"
                                        onClick={() => setStep(1)}
                                    >
                                        Geri
                                    </Button>
                                    <Button type="submit" className="w-1/2">
                                        Beni Arayın
                                    </Button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </Modal>
        </header>
    );
} 