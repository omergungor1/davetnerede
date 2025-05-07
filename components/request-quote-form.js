"use client";

import { useState } from 'react';
import { Button } from './ui/button';

export function RequestQuoteForm({ venueName, onSuccess, onClose }) {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        date: '',
        guestCount: '',
        acceptTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Temizle hataları kullanıcı düzenleme yaparken
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Ad Soyad zorunludur';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefon zorunludur';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Geçerli bir telefon numarası giriniz';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-posta zorunludur';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi giriniz';
        }

        if (!formData.date) {
            newErrors.date = 'Tarih seçimi zorunludur';
        }

        if (!formData.guestCount.trim()) {
            newErrors.guestCount = 'Tahmini misafir sayısı zorunludur';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Kullanıcı sözleşmesi ve hizmet şartlarını kabul etmelisiniz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Burada form verilerini gönderme işlemi gerçekleşecek
            // Örnek olarak bir simülasyon ekledim
            await new Promise(resolve => setTimeout(resolve, 1000));

            onSuccess?.();
            onClose?.();
        } catch (error) {
            console.error('Form gönderimi sırasında hata oluştu:', error);
            setErrors({
                form: 'Formunuz gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {venueName && (
                <div className="bg-lightgray p-3 rounded-md text-center mb-4">
                    <span className="font-medium">{venueName}</span> için teklif alıyorsunuz
                </div>
            )}

            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-text mb-1">
                    Ad Soyad *
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                    placeholder="Ad Soyad"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">
                    Telefon *
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                    placeholder="05XX XXX XX XX"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                    E-posta *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                    placeholder="ornek@mail.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-text mb-1">
                    Tarih *
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.date ? 'border-red-500' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
            </div>

            <div>
                <label htmlFor="guestCount" className="block text-sm font-medium text-text mb-1">
                    Tahmini Davetli Sayısı *
                </label>
                <input
                    type="number"
                    id="guestCount"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border ${errors.guestCount ? 'border-red-500' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
                    placeholder="Örn: 150"
                />
                {errors.guestCount && <p className="mt-1 text-sm text-red-500">{errors.guestCount}</p>}
            </div>

            <div className="pt-2">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="acceptTerms"
                            name="acceptTerms"
                            type="checkbox"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="acceptTerms" className={`font-medium ${errors.acceptTerms ? 'text-red-500' : 'text-darkgray'}`}>
                            Kullanıcı sözleşmesi ve hizmet şartlarını kabul ediyorum *
                        </label>
                        <div className="text-xs text-darkgray mt-1">
                            <a href="/kullanici-sozlesmesi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Kullanıcı Sözleşmesi
                            </a>
                            {' '}ve{' '}
                            <a href="/hizmet-sartlari" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                Hizmet Şartları
                            </a>
                        </div>
                    </div>
                </div>
                {errors.acceptTerms && <p className="mt-1 text-sm text-red-500">{errors.acceptTerms}</p>}
            </div>

            {errors.form && (
                <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
                    {errors.form}
                </div>
            )}

            <div className="pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'İşleniyor...' : 'Ücretsiz Teklif Al'}
                </Button>
                <p className="text-xs text-darkgray text-center mt-2">
                    Bilgileriniz gizlilik politikamız kapsamında korunacaktır.
                </p>
            </div>
        </form>
    );
} 