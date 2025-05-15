"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/auth-context';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import turkiyeIlIlce from '@/data/turkiye-il-ilce';

export default function FirmaKayit() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firma_adi: '',
        email: '',
        telefon: '',
        il: '',
        ilce: '',
        sifre: '',
        sifreTekrar: '',
        terms: false
    });
    const [ilceler, setIlceler] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    // İl değiştiğinde ilçeleri güncelle
    useEffect(() => {
        if (formData.il) {
            const selectedProvince = turkiyeIlIlce.provinces.find(
                p => p.name === formData.il
            );

            if (selectedProvince) {
                // Bu ile ait tüm ilçeleri filtrele
                const districts = turkiyeIlIlce.districts.filter(
                    d => d.province_id === selectedProvince.id
                ).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

                setIlceler(districts);
                // İl değiştiğinde ilçe seçimini sıfırla
                setFormData(prev => ({ ...prev, ilce: '' }));
            }
        } else {
            setIlceler([]);
        }
    }, [formData.il]);

    const validateStep = (step) => {
        const errors = {};

        if (step === 1) {
            if (!formData.firma_adi.trim()) errors.firma_adi = "Firma adı zorunludur";
            if (!formData.email.trim()) errors.email = "E-posta adresi zorunludur";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Geçerli bir e-posta adresi girin";

            if (!formData.telefon.trim()) errors.telefon = "Telefon numarası zorunludur";
            else if (!/^(05)[0-9][0-9][0-9]{7}$/.test(formData.telefon.replace(/\s/g, ''))) {
                errors.telefon = "Geçerli bir telefon numarası girin (05xx xxx xx xx)";
            }
        } else if (step === 2) {
            if (!formData.il) errors.il = "İl seçimi zorunludur";

            if (!formData.sifre) errors.sifre = "Şifre zorunludur";
            else if (formData.sifre.length < 6) errors.sifre = "Şifre en az 6 karakter olmalıdır";

            if (!formData.sifreTekrar) errors.sifreTekrar = "Şifre tekrarı zorunludur";
            else if (formData.sifre !== formData.sifreTekrar) errors.sifreTekrar = "Şifreler eşleşmiyor";

            if (!formData.terms) errors.terms = "Kullanım koşullarını kabul etmelisiniz";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Input değerine göre değişim yap
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Hata mesajını temizle
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const goToNextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(2);
        }
    };

    const goToPreviousStep = () => {
        setCurrentStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        setLoading(true);

        try {
            // Seçilen il ve ilçenin ID ve isimlerini bul
            const selectedProvince = turkiyeIlIlce.provinces.find(p => p.name === formData.il);
            let selectedDistrict = null;

            // Kullanıcı ilçe seçmişse ilçeyi bul
            if (formData.ilce) {
                selectedDistrict = turkiyeIlIlce.districts.find(
                    d => d.name === formData.ilce && d.province_id === selectedProvince?.id
                );
            }

            // Firma hesabı olarak kayıt
            const { data, error } = await signUp(
                formData.email,
                formData.sifre,
                {
                    full_name: formData.firma_adi,
                    phone: formData.telefon,
                    city_id: selectedProvince?.id || null,
                    city_name: selectedProvince?.name || '',
                    district_id: selectedDistrict?.id || null,
                    district_name: selectedDistrict?.name || ''
                },
                'company' // Kullanıcı tipini company olarak belirt
            );

            if (error) {
                if (error.message.includes('already registered')) {
                    toast.error('Bu e-posta adresi zaten kayıtlı');
                    setValidationErrors(prev => ({ ...prev, email: 'Bu e-posta adresi zaten kayıtlı' }));
                } else {
                    toast.error(error.message || 'Kayıt olurken bir hata oluştu');
                }
            } else {
                setIsSubmitSuccess(true);
                toast.success('Kayıt işlemi başarılı! Lütfen e-posta adresinizi kontrol ediniz.');

                // Başarılı kayıt sonrası 5 saniye sonra giriş sayfasına yönlendir
                setTimeout(() => {
                    router.push('/firmalar-icin/giris');
                }, 5000);
            }
        } catch (error) {
            console.error('Kayıt hatası:', error);
            toast.error('Kayıt olurken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-8">
                        <h1 className="text-2xl font-bold text-center mb-8">Firma Hesabı Oluştur</h1>

                        {isSubmitSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold mb-2">Kayıt İşlemi Başarılı!</h2>
                                <p className="text-gray-600 mb-4">
                                    E-posta adresinize bir doğrulama bağlantısı gönderdik. Lütfen hesabınızı aktifleştirmek için e-postanızı kontrol edin.
                                </p>
                                <p className="text-sm text-gray-500">
                                    Kısa süre içinde giriş sayfasına yönlendirileceksiniz...
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Adım 1: Temel Bilgiler */}
                                <div className={`transition-all duration-300 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="firma_adi" className="block text-sm font-medium text-text mb-1">
                                                Firma Adı
                                            </label>
                                            <input
                                                type="text"
                                                id="firma_adi"
                                                name="firma_adi"
                                                value={formData.firma_adi}
                                                onChange={handleChange}
                                                className={`w-full border ${validationErrors.firma_adi ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
                                            />
                                            {validationErrors.firma_adi && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.firma_adi}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                                                E-posta Adresi
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full border ${validationErrors.email ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
                                            />
                                            {validationErrors.email && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="telefon" className="block text-sm font-medium text-text mb-1">
                                                Telefon Numarası
                                            </label>
                                            <input
                                                type="tel"
                                                id="telefon"
                                                name="telefon"
                                                value={formData.telefon}
                                                onChange={handleChange}
                                                placeholder="05XX XXX XX XX"
                                                className={`w-full border ${validationErrors.telefon ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
                                            />
                                            {validationErrors.telefon && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.telefon}</p>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="button"
                                                onClick={goToNextStep}
                                                className="w-full"
                                                disabled={loading}
                                            >
                                                Devam Et
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Adım 2: Konum ve Şifre */}
                                <div className={`transition-all duration-300 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="il" className="block text-sm font-medium text-text mb-1">
                                                İl
                                            </label>
                                            <select
                                                id="il"
                                                name="il"
                                                value={formData.il}
                                                onChange={handleChange}
                                                className={`w-full border ${validationErrors.il ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
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
                                            {validationErrors.il && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.il}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="ilce" className="block text-sm font-medium text-text mb-1">
                                                İlçe
                                            </label>
                                            <select
                                                id="ilce"
                                                name="ilce"
                                                value={formData.ilce}
                                                onChange={handleChange}
                                                className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={loading || !formData.il}
                                            >
                                                <option value="">Seçiniz</option>
                                                {ilceler.map(district => (
                                                    <option key={district.id} value={district.name}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {!formData.il
                                                    ? 'Önce il seçiniz'
                                                    : 'İlçe seçimi isteğe bağlıdır'}
                                            </p>
                                        </div>

                                        <div>
                                            <label htmlFor="sifre" className="block text-sm font-medium text-text mb-1">
                                                Şifre
                                            </label>
                                            <input
                                                type="password"
                                                id="sifre"
                                                name="sifre"
                                                value={formData.sifre}
                                                onChange={handleChange}
                                                className={`w-full border ${validationErrors.sifre ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
                                            />
                                            {validationErrors.sifre && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.sifre}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="sifreTekrar" className="block text-sm font-medium text-text mb-1">
                                                Şifre Tekrar
                                            </label>
                                            <input
                                                type="password"
                                                id="sifreTekrar"
                                                name="sifreTekrar"
                                                value={formData.sifreTekrar}
                                                onChange={handleChange}
                                                className={`w-full border ${validationErrors.sifreTekrar ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
                                            />
                                            {validationErrors.sifreTekrar && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.sifreTekrar}</p>
                                            )}
                                        </div>

                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                name="terms"
                                                checked={formData.terms}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-primary border-gray-300 rounded mt-1 mr-2"
                                                disabled={loading}
                                            />
                                            <label htmlFor="terms" className="text-sm text-gray-600">
                                                <span>
                                                    <Link href="/kullanim-kosullari" className="text-primary hover:underline">Kullanım Koşullarını</Link> ve{' '}
                                                    <Link href="/gizlilik-politikasi" className="text-primary hover:underline">Gizlilik Politikasını</Link> okudum ve kabul ediyorum.
                                                </span>
                                            </label>
                                        </div>
                                        {validationErrors.terms && (
                                            <p className="text-xs text-red-600">{validationErrors.terms}</p>
                                        )}

                                        <div className="pt-4 flex gap-3">
                                            <Button
                                                type="button"
                                                onClick={goToPreviousStep}
                                                variant="outline"
                                                className="w-1/2"
                                                disabled={loading}
                                            >
                                                Geri Dön
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="w-1/2"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 size={18} className="mr-2 animate-spin" />
                                                        İşleniyor...
                                                    </>
                                                ) : 'Kaydı Tamamla'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}

                        {!isSubmitSuccess && (
                            <div className="mt-8 text-center">
                                <p className="text-sm text-darkgray mb-2">
                                    Zaten bir firma hesabınız var mı?
                                </p>
                                <Link
                                    href="/firmalar-icin/giris"
                                    className="text-primary font-medium hover:underline"
                                >
                                    Giriş Yap
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
} 