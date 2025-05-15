"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import turkiyeIlIlce from '@/data/turkiye-il-ilce';

export function CallMeForm({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [ilceler, setIlceler] = useState([]);
    const [formData, setFormData] = useState({
        firma: '',
        sehir: '',
        ilce: '',
        adSoyad: '',
        telefon: '',
        email: ''
    });

    // Şehir değiştiğinde ilçeleri güncelle
    useEffect(() => {
        if (formData.sehir) {
            // Seçilen ile ait province_id'yi bul
            const selectedProvince = turkiyeIlIlce.provinces.find(p => p.name === formData.sehir);

            if (selectedProvince) {
                // Bu ile ait tüm ilçeleri filtrele
                const districts = turkiyeIlIlce.districts.filter(
                    d => d.province_id === selectedProvince.id
                ).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

                setIlceler(districts);

                // Eğer daha önce ilçe seçilmişse sıfırla
                setFormData(prev => ({
                    ...prev,
                    ilce: ''
                }));
            }
        } else {
            setIlceler([]);
            setFormData(prev => ({
                ...prev,
                ilce: ''
            }));
        }
    }, [formData.sehir]);

    // Telefon numarası formatı
    const formatPhoneNumber = (value) => {
        if (!value) return "";

        // Sadece rakamları al
        const phoneNumber = value.replace(/\D/g, '');

        // Formatla: 05XX XXX XX XX
        if (phoneNumber.length <= 4) {
            return phoneNumber;
        } else if (phoneNumber.length <= 7) {
            return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
        } else if (phoneNumber.length <= 9) {
            return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
        } else {
            return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9, 11)}`;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'telefon') {
            // Sadece rakamları kaydet
            const phoneNumber = value.replace(/\D/g, '');
            setFormData({ ...formData, [name]: phoneNumber });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const resetForm = () => {
        setFormData({
            firma: '',
            sehir: '',
            ilce: '',
            adSoyad: '',
            telefon: '',
            email: ''
        });
        setStep(1);
        setIsSuccess(false);
    };

    const closeModal = () => {
        onClose();
        // Modalı kapatırken formu sıfırla
        setTimeout(resetForm, 300);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Form bilgilerini API'ye gönder
            // const response = await fetch('/api/call-request', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(formData)
            // });

            // if (!response.ok) {
            //     throw new Error('Bir hata oluştu');
            // }

            // Başarıyla tamamlandığını göster
            setIsSuccess(true);

            // Başarı durumunda callback fonksiyonu çağır
            if (onSuccess) {
                onSuccess(formData);
            }

            // 3 saniye sonra modalı kapat
            setTimeout(() => {
                closeModal();
            }, 3000);

        } catch (error) {
            console.error('Form gönderim hatası:', error);
            alert('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title={isSuccess ? "Talebiniz Alındı" : (step === 1 ? "Firma Bilgileriniz" : "İletişim Bilgileriniz")}>
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
                                <select
                                    id="sehir"
                                    name="sehir"
                                    value={formData.sehir}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="">Seçiniz</option>
                                    {turkiyeIlIlce.provinces.sort((a, b) =>
                                        a.name.localeCompare(b.name, 'tr')
                                    ).map(province => (
                                        <option key={province.id} value={province.name}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="ilce" className="block text-sm font-medium text-text mb-1">İlçe</label>
                                <select
                                    id="ilce"
                                    name="ilce"
                                    value={formData.ilce}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    disabled={!formData.sehir}
                                >
                                    <option value="">Seçiniz</option>
                                    {ilceler.map(district => (
                                        <option key={district.id} value={district.name}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
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
                                <label htmlFor="telefon" className="block text-sm font-medium text-text mb-1">Telefon</label>
                                <input
                                    type="tel"
                                    id="telefon"
                                    name="telefon"
                                    value={formatPhoneNumber(formData.telefon)}
                                    maxLength={14}
                                    placeholder="05XX XXX XX XX"
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
                                    placeholder="ornek@gmail.com"
                                    value={formData.email}
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
    );
} 