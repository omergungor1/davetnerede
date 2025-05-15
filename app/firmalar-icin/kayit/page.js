"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/auth-context';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft, ArrowRight, Plus, X, MapPin, Search, Check } from 'lucide-react';
import { formatPhoneNumber } from '@/components/ui/utils';
import turkiyeIlIlce from '@/data/turkiye-il-ilce';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';

export default function FirmaKayit() {
    const router = useRouter();
    const { signUp } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const totalSteps = 7;

    const [formData, setFormData] = useState({
        // Temel bilgiler - Adım 1
        firma_adi: '',
        firma_sahibi: '',
        tagline: '',
        aciklama: '',

        // İletişim bilgileri - Adım 2
        email: '',
        telefon: '',

        // Konum bilgileri - Adım 3
        adres: '',
        konum: { lat: null, lng: null },
        il: '',
        ilce: '',

        // Kapasite ve Özellikler - Adım 4
        kapasite: '',
        ozellikler: [],

        // Hizmetler - Adım 5
        hizmetler: [],

        // Paketler - Adım 6
        paketler: [],

        // Ekip üyeleri - Adım 7
        ekip_uyeleri: [],

        // Hesap bilgileri - Son adım
        sifre: '',
        sifreTekrar: '',
        terms: false
    });

    const [ilceler, setIlceler] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    // Örnek özellikler
    const ozellikOrnekleri = [
        'Açık Alan', 'Kapalı Alan', 'Deniz Manzarası', 'Havuz', 'Otopark',
        'Vale Hizmeti', 'Engelli Erişimi', 'İkram Servisi', 'Organizasyon', 'Dekorasyon',
        'Ses Sistemi', 'Işık Sistemi', 'Sahne', 'DJ Kabini', 'Projeksiyon'
    ];

    // Örnek hizmetler
    const hizmetOrnekleri = [
        'Düğün', 'Nişan', 'Söz', 'Kına', 'Mezuniyet',
        'Doğum Günü', 'Özel Organizasyon', 'Kurumsal Etkinlik', 'Yemekli Organizasyon', 'Kokteyl'
    ];

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

    const handleNumberInput = (e) => {
        const { name, value } = e.target;
        // Sayısal değer kontrolü
        if (value === '' || /^[0-9]+$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Hata mesajını temizle
            if (validationErrors[name]) {
                setValidationErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const addOzellik = (ozellik) => {
        if (!formData.ozellikler.includes(ozellik)) {
            setFormData(prev => ({
                ...prev,
                ozellikler: [...prev.ozellikler, ozellik]
            }));
        }
    };

    const removeOzellik = (ozellik) => {
        setFormData(prev => ({
            ...prev,
            ozellikler: prev.ozellikler.filter(item => item !== ozellik)
        }));
    };

    const addHizmet = (hizmet) => {
        if (!formData.hizmetler.includes(hizmet)) {
            setFormData(prev => ({
                ...prev,
                hizmetler: [...prev.hizmetler, hizmet]
            }));
        }
    };

    const removeHizmet = (hizmet) => {
        setFormData(prev => ({
            ...prev,
            hizmetler: prev.hizmetler.filter(item => item !== hizmet)
        }));
    };

    const addPaket = () => {
        const yeniPaket = {
            id: Date.now(),
            ad: '',
            aciklama: '',
            ozellikler: [],
            fiyat: '',
            fiyat_turu: 'paket', // 'paket' veya 'kisiBasina'
            kapasite: ''
        };
        setFormData(prev => ({
            ...prev,
            paketler: [...prev.paketler, yeniPaket]
        }));
    };

    const removePaket = (id) => {
        setFormData(prev => ({
            ...prev,
            paketler: prev.paketler.filter(paket => paket.id !== id)
        }));
    };

    const updatePaket = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            paketler: prev.paketler.map(paket =>
                paket.id === id ? { ...paket, [field]: value } : paket
            )
        }));
    };

    const addEkipUyesi = () => {
        const yeniUye = {
            id: Date.now(),
            isim: '',
            pozisyon: '',
            telefon: ''
        };
        setFormData(prev => ({
            ...prev,
            ekip_uyeleri: [...prev.ekip_uyeleri, yeniUye]
        }));
    };

    const removeEkipUyesi = (id) => {
        setFormData(prev => ({
            ...prev,
            ekip_uyeleri: prev.ekip_uyeleri.filter(uye => uye.id !== id)
        }));
    };

    const updateEkipUyesi = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            ekip_uyeleri: prev.ekip_uyeleri.map(uye =>
                uye.id === id ? { ...uye, [field]: value } : uye
            )
        }));
    };

    const validateStep = (step) => {
        const errors = {};

        switch (step) {
            case 1: // Temel bilgiler
                if (!formData.firma_adi.trim()) errors.firma_adi = "Firma adı zorunludur";
                if (!formData.firma_sahibi.trim()) errors.firma_sahibi = "Firma sahibi bilgisi zorunludur";
                break;

            case 2: // İletişim bilgileri
                if (!formData.email.trim()) errors.email = "E-posta adresi zorunludur";
                else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Geçerli bir e-posta adresi girin";

                if (!formData.telefon.trim()) errors.telefon = "Telefon numarası zorunludur";
                else if (!/^(05)[0-9][0-9][0-9]{7}$/.test(formData.telefon.replace(/\s/g, ''))) {
                    errors.telefon = "Geçerli bir telefon numarası girin (05xx xxx xx xx)";
                }
                break;

            case 3: // Konum bilgileri
                if (!formData.adres.trim()) errors.adres = "Adres bilgisi zorunludur";
                if (!formData.il) errors.il = "İl seçimi zorunludur";
                break;

            case 4: // Kapasite ve Özellikler
                if (!formData.kapasite) errors.kapasite = "Kapasite zorunludur";
                break;

            case 7: // Hesap bilgileri (Son adım)
                if (!formData.sifre) errors.sifre = "Şifre zorunludur";
                else if (formData.sifre.length < 6) errors.sifre = "Şifre en az 6 karakter olmalıdır";

                if (!formData.sifreTekrar) errors.sifreTekrar = "Şifre tekrarı zorunludur";
                else if (formData.sifre !== formData.sifreTekrar) errors.sifreTekrar = "Şifreler eşleşmiyor";

                if (!formData.terms) errors.terms = "Kullanım koşullarını kabul etmelisiniz";
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const goToNextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            //sayfanın en üstüne scroll et smooth
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const goToPreviousStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        //sayfanın en üstüne scroll et smooth
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const openConfirmModal = () => {
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
    };

    const goToCompanyPage = () => {
        router.push('/firmalar-icin');
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
                    owner: formData.firma_sahibi,
                    tagline: formData.tagline,
                    description: formData.aciklama,
                    address: formData.adres,
                    location: formData.konum,
                    city_id: selectedProvince?.id || null,
                    city_name: selectedProvince?.name || '',
                    district_id: selectedDistrict?.id || null,
                    district_name: selectedDistrict?.name || '',
                    capacity: formData.kapasite,
                    features: formData.ozellikler,
                    services: formData.hizmetler,
                    packages: formData.paketler,
                    team_members: formData.ekip_uyeleri
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
                setLoading(false);
                return;
            }

            // Kullanıcı kaydı başarılı olduysa, business kaydını yap
            if (data && data.user) {
                const userId = data.user.id;

                // Business API endpoint'ine istek at
                const businessResponse = await fetch('/api/businesses/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        name: formData.firma_adi,
                        description: formData.aciklama,
                        tagline: formData.tagline,
                        capacity: formData.kapasite,
                        phone: formData.telefon,
                        email: formData.email,
                        address: formData.adres,
                        city_id: selectedProvince?.id || null,
                        city_name: selectedProvince?.name || '',
                        district_id: selectedDistrict?.id || null,
                        district_name: selectedDistrict?.name || '',
                        lat: formData.konum.lat,
                        lng: formData.konum.lng,
                        features: formData.ozellikler,
                        services: formData.hizmetler,
                        team_members: formData.ekip_uyeleri,
                        packages: formData.paketler,
                        owner_name: formData.firma_sahibi,
                        password: formData.sifre
                    }),
                });

                const businessResult = await businessResponse.json();

                if (!businessResponse.ok) {
                    console.error('İşletme kayıt hatası:', businessResult.error);
                    toast.error('İşletme bilgileri kaydedilirken bir hata oluştu');
                    setLoading(false);
                    return;
                }

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

    // Adım başlıkları
    const stepTitles = [
        "Temel Bilgiler",
        "İletişim Bilgileri",
        "Konum Bilgileri",
        "Kapasite ve Özellikler",
        "Hizmetler",
        "Paketler",
        "Ekip Üyeleri",
        "Hesap Oluştur"
    ];

    return (
        <div className="container mx-auto px-4 py-6 md:py-12">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-1 md:px-6 py-8">
                    <h1 className="text-2xl font-bold text-center mb-8">Firma Kayıt</h1>

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
                        <>
                            {/* Adımlar için ilerleme çubuğu */}
                            <div className="mb-8 relative">
                                <div className="absolute w-full top-3 h-2 bg-gray-200 rounded overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300 rounded-full"
                                        style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mb-2">
                                    {Array.from({ length: totalSteps }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => validateStep(currentStep) && setCurrentStep(i + 1)}
                                            className={`w-8 h-8 rounded-full flex z-10 items-center justify-center ${currentStep > i + 1
                                                ? 'bg-primary text-white'
                                                : currentStep === i + 1
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {currentStep > i + 1 ? <Check size={14} /> : i + 1}
                                        </button>
                                    ))}
                                </div>
                                <h2 className="text-xl font-semibold mt-4">
                                    {stepTitles[currentStep - 1]}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Adım 1: Temel Bilgiler */}
                                <div className={`transition-all duration-300 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="firma_adi" className="block text-sm font-medium text-text mb-1">
                                                İşletme Adı <span className="text-red-500">*</span>
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
                                            <label htmlFor="firma_sahibi" className="block text-sm font-medium text-text mb-1">
                                                İşletme Sahibi <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="firma_sahibi"
                                                name="firma_sahibi"
                                                value={formData.firma_sahibi}
                                                onChange={handleChange}
                                                className={`w-full border ${validationErrors.firma_sahibi ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
                                            />
                                            {validationErrors.firma_sahibi && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.firma_sahibi}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="tagline" className="block text-sm font-medium text-text mb-1">
                                                Slogan
                                            </label>
                                            <input
                                                type="text"
                                                id="tagline"
                                                name="tagline"
                                                value={formData.tagline}
                                                onChange={handleChange}
                                                className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={loading}
                                                placeholder="Örn: Hayallerinizi gerçeğe dönüştürüyoruz"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="aciklama" className="block text-sm font-medium text-text mb-1">
                                                Açıklama
                                            </label>
                                            <textarea
                                                id="aciklama"
                                                name="aciklama"
                                                value={formData.aciklama}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={loading}
                                                placeholder="İşletmenizi tanıtan kısa bir açıklama yazın..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Adım 2: İletişim Bilgileri */}
                                <div className={`transition-all duration-300 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                                                E-posta Adresi <span className="text-red-500">*</span>
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
                                            <p className="text-xs text-gray-500 mt-1">
                                                Bu e-posta ile hesap oluşturulacak, lütfen aktif bir adres girin
                                            </p>
                                        </div>

                                        <div>
                                            <label htmlFor="telefon" className="block text-sm font-medium text-text mb-1">
                                                Telefon Numarası <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                id="telefon"
                                                name="telefon"
                                                value={formatPhoneNumber(formData.telefon)}
                                                onChange={handleChange}
                                                placeholder="05XX XXX XX XX"
                                                maxLength={14}
                                                className={`w-full border ${validationErrors.telefon ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
                                            />
                                            {validationErrors.telefon && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.telefon}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Adım 3: Konum Bilgileri */}
                                <div className={`transition-all duration-300 ${currentStep === 3 ? 'block' : 'hidden'}`}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="adres" className="block text-sm font-medium text-text mb-1">
                                                Adres <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="adres"
                                                name="adres"
                                                value={formData.adres}
                                                onChange={handleChange}
                                                rows={3}
                                                className={`w-full border ${validationErrors.adres ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
                                                placeholder="Örn: Atatürk Cad. No:123 Kat:5 Daire:10"
                                            />
                                            {validationErrors.adres && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.adres}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="il" className="block text-sm font-medium text-text mb-1">
                                                    İl <span className="text-red-500">*</span>
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
                                                    {!formData.il ? 'Önce il seçiniz' : 'İlçe seçimi isteğe bağlıdır'}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text mb-1">
                                                Harita Konumu
                                            </label>
                                            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center border border-border">
                                                <div className="text-center p-4">
                                                    <MapPin size={36} className="mx-auto text-gray-400 mb-2" />
                                                    <p className="text-gray-600 text-sm mb-2">Harita burada görüntülenecek</p>
                                                    <p className="text-xs text-gray-500">
                                                        (Google Harita entegrasyonu ileride eklenecektir)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Adım 4: Kapasite ve Özellikler */}
                                <div className={`transition-all duration-300 ${currentStep === 4 ? 'block' : 'hidden'}`}>
                                    <div className="space-y-6">
                                        <div>
                                            <label htmlFor="kapasite" className="block text-sm font-medium text-text mb-1">
                                                Mekan Kapasitesi <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="kapasite"
                                                name="kapasite"
                                                value={formData.kapasite}
                                                onChange={handleNumberInput}
                                                className={`w-full border ${validationErrors.kapasite ? 'border-red-300' : 'border-border'} rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                disabled={loading}
                                                placeholder="Örn: 50"
                                            />
                                            {validationErrors.kapasite && (
                                                <p className="mt-1 text-xs text-red-600">{validationErrors.kapasite}</p>
                                            )}
                                        </div>

                                        <div className="pt-4">
                                            <label className="block text-sm font-medium text-text mb-3">
                                                Özellikler / Olanaklar
                                            </label>

                                            {/* Seçilen özellikler */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {formData.ozellikler.map((ozellik, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
                                                    >
                                                        {ozellik}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOzellik(ozellik)}
                                                            className="ml-2 text-primary hover:text-primary/80"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {formData.ozellikler.length === 0 && (
                                                    <p className="text-gray-500 text-sm italic">Henüz özellik eklenmemiş</p>
                                                )}
                                            </div>

                                            {/* Önerilen özellikler */}
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-600 mb-2">Önerilen Özellikler:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {ozellikOrnekleri.map((ozellik, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => addOzellik(ozellik)}
                                                            disabled={formData.ozellikler.includes(ozellik)}
                                                            className={`border border-gray-300 rounded-full px-3 py-1 text-sm ${formData.ozellikler.includes(ozellik)
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'hover:bg-gray-100 text-gray-700'
                                                                }`}
                                                        >
                                                            + {ozellik}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Özel özellik ekleme */}
                                            <div className="mt-4 flex">
                                                <input
                                                    type="text"
                                                    id="yeni-ozellik"
                                                    placeholder="Özel özellik ekle..."
                                                    className="w-full border border-border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                                            e.preventDefault();
                                                            addOzellik(e.target.value.trim());
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-primary text-white px-3 rounded-r-md hover:bg-primary/90"
                                                    onClick={(e) => {
                                                        const input = document.getElementById('yeni-ozellik');
                                                        if (input.value.trim()) {
                                                            addOzellik(input.value.trim());
                                                            input.value = '';
                                                        }
                                                    }}
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Özellik yazdıktan sonra Enter tuşuna basın veya + butonuna tıklayın
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Adım 5: Hizmetler */}
                                <div className={`transition-all duration-300 ${currentStep === 5 ? 'block' : 'hidden'}`}>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-text mb-3">
                                                Hizmetler / Organizasyon Türleri
                                            </label>

                                            {/* Seçilen hizmetler */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {formData.hizmetler.map((hizmet, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
                                                    >
                                                        {hizmet}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeHizmet(hizmet)}
                                                            className="ml-2 text-primary hover:text-primary/80"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {formData.hizmetler.length === 0 && (
                                                    <p className="text-gray-500 text-sm italic">Henüz hizmet eklenmemiş</p>
                                                )}
                                            </div>

                                            {/* Önerilen hizmetler */}
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-600 mb-2">Önerilen Hizmetler:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {hizmetOrnekleri.map((hizmet, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => addHizmet(hizmet)}
                                                            disabled={formData.hizmetler.includes(hizmet)}
                                                            className={`border border-gray-300 rounded-full px-3 py-1 text-sm ${formData.hizmetler.includes(hizmet)
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'hover:bg-gray-100 text-gray-700'
                                                                }`}
                                                        >
                                                            + {hizmet}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Özel hizmet ekleme */}
                                            <div className="mt-4 flex">
                                                <input
                                                    type="text"
                                                    id="yeni-hizmet"
                                                    placeholder="Özel hizmet ekle..."
                                                    className="w-full border border-border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                                            e.preventDefault();
                                                            addHizmet(e.target.value.trim());
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-primary text-white px-3 rounded-r-md hover:bg-primary/90"
                                                    onClick={(e) => {
                                                        const input = document.getElementById('yeni-hizmet');
                                                        if (input.value.trim()) {
                                                            addHizmet(input.value.trim());
                                                            input.value = '';
                                                        }
                                                    }}
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Hizmet yazdıktan sonra Enter tuşuna basın veya + butonuna tıklayın
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Adım 6: Paketler */}
                                <div className={`transition-all duration-300 ${currentStep === 6 ? 'block' : 'hidden'}`}>
                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row justify-between items-center">
                                            <label className="block text-sm font-medium text-text">
                                                Paketler / Fiyatlandırma
                                            </label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addPaket}
                                                className="flex items-center text-xs"
                                            >
                                                <Plus size={16} className="mr-1" /> Yeni Paket Ekle
                                            </Button>
                                        </div>

                                        {formData.paketler.length === 0 ? (
                                            <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                                                <p className="text-gray-500 mb-3">Henüz bir paket eklenmemiş</p>
                                                <Button
                                                    type="button"
                                                    onClick={addPaket}
                                                    variant="outline"
                                                    className="mx-auto"
                                                >
                                                    <Plus size={18} className="mr-2" /> İlk Paketi Ekle
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {formData.paketler.map((paket, index) => (
                                                    <div
                                                        key={paket.id}
                                                        className="border border-gray-200 rounded-md p-4 bg-white shadow-sm"
                                                    >
                                                        <div className="flex justify-between items-start mb-4">
                                                            <h3 className="font-medium text-lg">
                                                                {paket.ad ? paket.ad : `Paket ${index + 1}`}
                                                            </h3>
                                                            <button
                                                                type="button"
                                                                onClick={() => removePaket(paket.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <div>
                                                                <label className="block text-sm font-medium text-text mb-1">
                                                                    Paket Adı
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={paket.ad}
                                                                    onChange={(e) => updatePaket(paket.id, 'ad', e.target.value)}
                                                                    className="w-full border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                    placeholder="Örn: Standart Düğün Paketi"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-text mb-1">
                                                                    Açıklama
                                                                </label>
                                                                <textarea
                                                                    value={paket.aciklama}
                                                                    onChange={(e) => updatePaket(paket.id, 'aciklama', e.target.value)}
                                                                    rows={2}
                                                                    className="w-full border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                    placeholder="Paket açıklaması..."
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-text mb-1">
                                                                    Paket Özellikleri
                                                                </label>
                                                                <div className="flex items-center mb-2">
                                                                    <input
                                                                        type="text"
                                                                        id={`ozellik-${paket.id}`}
                                                                        placeholder="Özellik ekleyin ve Enter'a basın"
                                                                        className="w-full border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                                                e.preventDefault();
                                                                                const updatedOzellikler = [...paket.ozellikler, e.target.value.trim()];
                                                                                updatePaket(paket.id, 'ozellikler', updatedOzellikler);
                                                                                e.target.value = '';
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    {paket.ozellikler.map((ozellik, idx) => (
                                                                        <div
                                                                            key={idx}
                                                                            className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center"
                                                                        >
                                                                            {ozellik}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const updatedOzellikler = paket.ozellikler.filter((_, i) => i !== idx);
                                                                                    updatePaket(paket.id, 'ozellikler', updatedOzellikler);
                                                                                }}
                                                                                className="ml-2 text-gray-500 hover:text-gray-700"
                                                                            >
                                                                                <X size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    {paket.ozellikler.length === 0 && (
                                                                        <p className="text-gray-500 text-xs italic">Henüz özellik eklenmemiş</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-text mb-1">
                                                                        Fiyat
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={paket.fiyat}
                                                                        onChange={(e) => {
                                                                            // Sadece sayı ve nokta kabul et
                                                                            if (e.target.value === '' || /^[0-9]*\.?[0-9]*$/.test(e.target.value)) {
                                                                                updatePaket(paket.id, 'fiyat', e.target.value);
                                                                            }
                                                                        }}
                                                                        className="w-full border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                        placeholder="Örn: 15000"
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-text mb-1">
                                                                        Fiyat Türü
                                                                    </label>
                                                                    <select
                                                                        value={paket.fiyat_turu}
                                                                        onChange={(e) => updatePaket(paket.id, 'fiyat_turu', e.target.value)}
                                                                        className="w-full border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                    >
                                                                        <option value="paket">Paket Fiyatı</option>
                                                                        <option value="kisiBasina">Kişi Başı</option>
                                                                    </select>
                                                                </div>

                                                                <div>
                                                                    <label className="block text-sm font-medium text-text mb-1">
                                                                        Kapasite
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={paket.kapasite}
                                                                        onChange={(e) => {
                                                                            // Sadece sayı kabul et
                                                                            if (e.target.value === '' || /^[0-9]+$/.test(e.target.value)) {
                                                                                updatePaket(paket.id, 'kapasite', e.target.value);
                                                                            }
                                                                        }}
                                                                        className="w-full border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                        placeholder="Kişi sayısı"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Adım 7: Ekip Üyeleri */}
                                <div className={`transition-all duration-300 ${currentStep === 7 ? 'block' : 'hidden'}`}>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-sm font-medium text-text">
                                                Ekip Üyeleri
                                            </label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addEkipUyesi}
                                                className="flex items-center text-xs"
                                            >
                                                <Plus size={16} className="mr-1" /> Yeni Üye Ekle
                                            </Button>
                                        </div>

                                        {formData.ekip_uyeleri.length === 0 ? (
                                            <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
                                                <p className="text-gray-500 mb-3">Henüz bir ekip üyesi eklenmemiş</p>
                                                <Button
                                                    type="button"
                                                    onClick={addEkipUyesi}
                                                    variant="outline"
                                                    className="mx-auto"
                                                >
                                                    <Plus size={18} className="mr-2" /> İlk Üyeyi Ekle
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {formData.ekip_uyeleri.map((uye, index) => (
                                                    <div
                                                        key={uye.id}
                                                        className="border border-gray-200 rounded-md p-4 bg-white shadow-sm"
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h3 className="font-medium">
                                                                {uye.isim ? uye.isim : `Ekip Üyesi ${index + 1}`}
                                                            </h3>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeEkipUyesi(uye.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                            <div>
                                                                <label className="block text-sm font-medium text-text mb-1">
                                                                    İsim
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={uye.isim}
                                                                    onChange={(e) => updateEkipUyesi(uye.id, 'isim', e.target.value)}
                                                                    className="w-full border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                    placeholder="Ad Soyad"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-text mb-1">
                                                                    Pozisyon
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={uye.pozisyon}
                                                                    onChange={(e) => updateEkipUyesi(uye.id, 'pozisyon', e.target.value)}
                                                                    className="w-full border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                    placeholder="Örn: Satış Müdürü"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-text mb-1">
                                                                    Telefon
                                                                </label>
                                                                <input
                                                                    type="tel"
                                                                    value={formatPhoneNumber(uye.telefon)}
                                                                    maxLength={14}
                                                                    onChange={(e) => updateEkipUyesi(uye.id, 'telefon', e.target.value)}
                                                                    className="w-full border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                    placeholder="05XX XXX XX XX"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-500 mt-2">
                                            Firma içinde iletişime geçilebilecek kişileri ekleyin
                                        </p>
                                    </div>
                                </div>

                                {/* Adım 8: Hesap Bilgileri ve Kayıt */}
                                <div className={`transition-all duration-300 ${currentStep === totalSteps ? 'block' : 'hidden'}`}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="sifre" className="block text-sm font-medium text-text mb-1">
                                                Şifre <span className="text-red-500">*</span>
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
                                                Şifre Tekrar <span className="text-red-500">*</span>
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
                                                    <Link href="/kullanim-kosullari" target="_blank" className="text-primary hover:underline">Kullanım Koşullarını</Link> ve{' '}
                                                    <Link href="/gizlilik-politikasi" target="_blank" className="text-primary hover:underline">Gizlilik Politikasını</Link> okudum ve kabul ediyorum.
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
                                                className="w-1/2 flex items-center justify-center"
                                                disabled={loading}
                                            >
                                                <ArrowLeft size={18} className="mr-2" /> Geri Dön
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
                                                ) : 'Kayıt Ol'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Adım arası navigasyon butonları (2-7 arası adımlar için) */}
                                {currentStep > 0 && currentStep < totalSteps && (
                                    <div className="pt-4 flex gap-3 justify-center">
                                        {currentStep > 1 && <Button
                                            type="button"
                                            onClick={goToPreviousStep}
                                            variant="outline"
                                            className="w-1/2 flex items-center justify-center"
                                            disabled={loading}
                                        >
                                            <ArrowLeft size={18} className="mr-2" /> Geri Dön
                                        </Button>}
                                        {currentStep === 1 && <Button
                                            type="button"
                                            onClick={openConfirmModal}
                                            variant="outline"
                                            className="w-1/2 flex items-center justify-center"
                                            disabled={loading}
                                        >
                                            <X size={18} className="mr-2" /> İptal Et
                                        </Button>}
                                        <Button
                                            type="button"
                                            onClick={goToNextStep}
                                            className="w-1/2 flex items-center justify-center"
                                            disabled={loading}
                                        >
                                            Devam Et <ArrowRight size={18} className="ml-2" />
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </>
                    )}
                </div>
            </div>

            {/* İptal işlemi için onay modalı */}
            <Dialog open={isConfirmModalOpen} onOpenChange={closeConfirmModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Kayıt İşlemini İptal Et</DialogTitle>
                        <DialogDescription className="pt-3 text-red-500 font-medium">
                            Dikkat! Tüm girdiğiniz bilgiler silinecektir.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-700">
                            Firma kayıt işlemini iptal etmek istediğinizden emin misiniz? İşlemi iptal ederseniz, şu ana kadar girdiğiniz tüm bilgiler kaybolacaktır.
                        </p>
                    </div>
                    <DialogFooter className="flex space-x-2">
                        <Button type="button" variant="outline" onClick={closeConfirmModal}>
                            Kayıda Devam Et
                        </Button>
                        <Button type="button" variant="destructive" onClick={goToCompanyPage}>
                            <X size={16} className="mr-2" /> İptal Et ve Çık
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 