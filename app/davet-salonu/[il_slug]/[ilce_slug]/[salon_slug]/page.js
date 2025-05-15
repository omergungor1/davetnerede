"use client";


import React, { useState, useEffect } from 'react';
import { Layout } from '../../../../../components/layout';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardTitle } from '../../../../../components/ui/card';
import { Star, Heart, MapPin, Phone, Mail, Clock, ChevronRight, CheckCircle, X, Calendar, Users } from 'lucide-react';
import { ImageGallery } from '../../../../../components/ui/image-gallery';


// Örnek mekan verisi
const venue = {
    id: 1,
    name: 'Mövenpick Hotel İstanbul Asia Airport',
    images: [
        '/images/salon-1.webp',
        '/images/salon-2.webp',
        '/images/salon-4.webp',
        '/images/salon-6.webp',
    ],
    rating: 5.0,
    reviewCount: 111,
    address: 'Fatih Sultan Mehmet Mahallesi, Balkan Caddesi No:58, 34770 Ümraniye/İstanbul',
    phone: '0216 666 64 64',
    website: 'www.movenpick.com',
    capacity: '50-1000',
    minPrice: 1350,
    maxPrice: 2500,
    description: 'Modern ve ihtişamlı atmosferiyle Mövenpick Hotel İstanbul Asia Airport, hayalinizdeki düğün için mükemmel bir mekan. Geniş salonları, profesyonel hizmet anlayışı ve lezzetli menüleriyle unutulmaz bir düğün deneyimi yaşamanızı sağlar.',
    features: [
        'Modern ve İhtişamlı',
        'Menü dahildir',
        'Geniş otpark',
        'Şahne ışık sistemi',
        'Geniş otopak',
        '5 yıldızlı otel',
        'Jimmy ib'
    ],
    services: [
        'Düğün Paketi',
        'Nikah Töreni',
        'Düğün Sonrası Konaklama',
        'Tekne Düğünü',
        'Düğün Fotoğrafçısı',
        'Havai Fişek Gösterisi'
    ],
    team: [
        {
            id: 1,
            name: 'Mehmet Aydın',
            position: 'Satış Müdürü',
            phone: '0533 123 4567'
        },
        {
            id: 2,
            name: 'Ayşe Yılmaz',
            position: 'Organizasyon Sorumlusu',
            phone: '0533 765 4321'
        }
    ],
    similarVenues: [
        {
            id: 2,
            name: 'Casamento',
            image: '/images/salon-8.webp',
            price: 3500,
        },
        {
            id: 3,
            name: 'Plus Hotel',
            image: '/images/salon-9.jpg',
            price: 2500,
        },
        {
            id: 4,
            name: 'May Otel',
            image: '/images/salon-10.jpg',
            price: 900,
        }
    ],
    packages: [
        {
            id: 1,
            name: 'Nişan Paketi',
            type: 'Yemekli',
            priceType: 'Kişi Başı',
            price: 2000,
            features: ['5 çeşit sıcak aperatif', 'Limitsiz yerli içecek', '3 çeşit ana yemek', 'Düğün pastası', 'Canlı müzik', 'Özel masa süslemeleri'],
            description: 'Hafta içi saat 12:00-17:00 arası geçerli, menü dahil.'
        },
        {
            id: 2,
            name: 'Söz&Nişan Paketi',
            type: 'Yemekli',
            priceType: 'Kişi Başı',
            price: 2500,
            features: ['8 çeşit sıcak aperatif', 'Limitsiz yerli içecek', '4 çeşit ana yemek', 'Düğün pastası', 'Özel ışık ve ses sistemi', 'Canlı müzik', 'Masa ve sandalye giydirme'],
            description: 'Cumartesi-Pazar günleri saat 12:00-18:00 arası geçerli, menü dahil.'
        },
        {
            id: 3,
            name: 'Yemekli Söz&nişan Paketi',
            type: 'İçecek ve Aperatif',
            priceType: 'Toplam',
            price: 40000,
            guestCount: '100 kişiye kadar',
            features: ['12 çeşit soğuk kanape', '8 çeşit sıcak aperatif', 'Limitsiz yerli içecek', 'DJ performansı', 'Fotoğraf çekimi'],
            description: 'Hafta içi saat 15:00-19:00 arası geçerli, içecek ve aperatifler dahil.'
        }
    ],
    comments: [
        {
            id: 1,
            user: 'Fulden & Yağız',
            date: '01.01.2024',
            rating: 5,
            comment: 'Harika bir düğün deneyimi yaşadık. Personel çok ilgiliydi, mekan muhteşemdi. Herkese tavsiye ederiz!'
        },
        {
            id: 2,
            name: 'Merve & İlkay',
            date: '15.02.2024',
            rating: 4.8,
            comment: 'Düğünümüzde herşey mükemmeldi. Yemekler lezzetli, personel çok nazikti. Misafirlerimizin hepsi çok memnun kaldı.'
        }
    ],
    reservations: [
        {
            id: 1,
            name: 'Ayşe Yılmaz',
            date: '25.07.2024',
            guestCount: 150,
            status: 'beklemede',
            message: 'Düğünümüz için bilgi almak istiyoruz. Belirtilen tarihte salon müsait mi?',
            phone: '0555 123 4567',
            email: 'ayse@example.com',
            createdAt: '20.05.2024'
        },
        {
            id: 2,
            name: 'Mehmet Demir',
            date: '12.08.2024',
            guestCount: 200,
            status: 'onaylandı',
            message: 'Yemekli organizasyon fiyatı hakkında detaylı bilgi almak istiyoruz.',
            phone: '0532 987 6543',
            email: 'mehmet@example.com',
            createdAt: '15.05.2024'
        },
        {
            id: 3,
            name: 'Zeynep Kaya',
            date: '05.10.2024',
            guestCount: 80,
            status: 'beklemede',
            message: 'Nikah sonrası kokteyl düşünüyoruz. Dış mekan seçenekleriniz var mı?',
            phone: '0541 456 7890',
            email: 'zeynep@example.com',
            createdAt: '21.05.2024'
        }
    ],
    questions: [
        {
            id: 1,
            user: 'Nazlı T.',
            question: 'Hafta içi organizasyonlarda fiyat indirimi yapıyor musunuz?',
            date: '10.05.2024',
            answer: 'Evet, hafta içi organizasyonlarımızda %15 indirim sağlıyoruz. Detaylı bilgi için bize ulaşabilirsiniz.',
            answerDate: '11.05.2024'
        },
        {
            id: 2,
            user: 'Kerem A.',
            question: 'Mekanınızda düğün dışında doğum günü organizasyonu da yapılabiliyor mu?',
            date: '15.05.2024',
            answer: 'Kesinlikle, doğum günü organizasyonları için özel paketlerimiz bulunmaktadır. Size özel fiyat teklifi için iletişime geçebilirsiniz.',
            answerDate: '16.05.2024'
        },
        {
            id: 3,
            user: 'Selin B.',
            question: 'İslami düğün organizasyonu yapıyor musunuz? Ayrı salonlarınız var mı?',
            date: '18.05.2024',
            answer: null,
            answerDate: null
        }
    ]
};

export default function VenueDetail({ params }) {

    //parametreden il ilçe ve salon slugini al
    const unwrappedParams = React.use(params);
    const { il_slug, ilce_slug, salon_slug } = unwrappedParams;
    console.log('il_slug', il_slug);
    console.log('ilce_slug', ilce_slug);
    console.log('salon_slug', salon_slug);

    // Resim galerisi için state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showRandevuModal, setShowRandevuModal] = useState(false);
    const [randevuFormData, setRandevuFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        topic: '',
        notes: ''
    });
    const [randevuSuccess, setRandevuSuccess] = useState(false);
    const [showSoruModal, setShowSoruModal] = useState(false);
    const [soruData, setSoruData] = useState('');
    const [soruSuccess, setSoruSuccess] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Gerçek uygulamada oturum durumu kontrol edilir
    const [showYorumModal, setShowYorumModal] = useState(false);
    const [yorumData, setYorumData] = useState({
        rating: 0,
        comment: ''
    });
    const [yorumSuccess, setYorumSuccess] = useState(false);
    const [showOnRezervasyonModal, setShowOnRezervasyonModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [onRezervasyonData, setOnRezervasyonData] = useState({
        fullName: '',
        email: '',
        phone: '',
        date: '',
        guestCount: '',
        notes: ''
    });
    const [onRezervasyonSuccess, setOnRezervasyonSuccess] = useState(false);
    const [showTeklifModal, setShowTeklifModal] = useState(false);
    const [teklifFormData, setTeklifFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        date: '',
        isDateUndecided: false,
        guestCount: '',
        notes: '',
        terms: false
    });
    const [teklifSuccess, setTeklifSuccess] = useState(false);

    const openLightbox = (index) => {
        setActiveImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % venue.images.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex - 1 + venue.images.length) % venue.images.length);
    };

    const handleRandevuChange = (e) => {
        const { name, value } = e.target;
        setRandevuFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRandevuSubmit = (e) => {
        e.preventDefault();
        console.log('Randevu formu gönderildi:', randevuFormData);

        // Form işleme simülasyonu
        setRandevuSuccess(true);

        // 3 saniye sonra modalı kapat
        setTimeout(() => {
            setRandevuSuccess(false);
            setShowRandevuModal(false);
            setRandevuFormData({
                fullName: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                topic: '',
                notes: ''
            });
        }, 3000);
    };

    const handleSoruChange = (e) => {
        setSoruData(e.target.value);
    };

    const handleSoruSubmit = (e) => {
        e.preventDefault();
        console.log('Soru gönderildi:', soruData);

        // Form işleme simülasyonu
        setSoruSuccess(true);

        // 3 saniye sonra modalı kapat
        setTimeout(() => {
            setSoruSuccess(false);
            setShowSoruModal(false);
            setSoruData('');
        }, 3000);
    };

    const openSoruModal = () => {
        // if (isLoggedIn) {
        setShowSoruModal(true);
        // } 
    };

    const openYorumModal = () => {
        // if (isLoggedIn) {
        setShowYorumModal(true);
        // } 
    };

    const handleYorumChange = (e) => {
        const { name, value } = e.target;
        setYorumData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRatingChange = (rating) => {
        setYorumData(prev => ({
            ...prev,
            rating
        }));
    };

    const handleYorumSubmit = (e) => {
        e.preventDefault();
        console.log('Yorum gönderildi:', yorumData);

        // Form işleme simülasyonu
        setYorumSuccess(true);

        // 3 saniye sonra modalı kapat
        setTimeout(() => {
            setYorumSuccess(false);
            setShowYorumModal(false);
            setYorumData({
                rating: 0,
                comment: ''
            });
        }, 3000);
    };

    const openOnRezervasyonModal = (pkg) => {
        setSelectedPackage(pkg);
        setShowOnRezervasyonModal(true);
    };

    const handleOnRezervasyonChange = (e) => {
        const { name, value } = e.target;
        setOnRezervasyonData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOnRezervasyonSubmit = (e) => {
        e.preventDefault();
        console.log('Ön rezervasyon:', {
            package: selectedPackage,
            ...onRezervasyonData
        });

        // Form işleme simülasyonu
        setOnRezervasyonSuccess(true);

        // 3 saniye sonra modalı kapat
        setTimeout(() => {
            setOnRezervasyonSuccess(false);
            setShowOnRezervasyonModal(false);
            setOnRezervasyonData({
                fullName: '',
                email: '',
                phone: '',
                date: '',
                guestCount: '',
                notes: ''
            });
            setSelectedPackage(null);
        }, 3000);
    };

    const handleTeklifChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (name === 'isDateUndecided') {
                setTeklifFormData(prev => ({
                    ...prev,
                    [name]: checked,
                    date: checked ? '' : prev.date
                }));
            } else {
                setTeklifFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        } else {
            setTeklifFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleTeklifSubmit = (e) => {
        e.preventDefault();
        console.log('Teklif formunu gönderildi:', teklifFormData);

        // Form işleme simülasyonu
        setTeklifSuccess(true);

        // 3 saniye sonra modalı kapat
        setTimeout(() => {
            setTeklifSuccess(false);
            setShowTeklifModal(false);
            setTeklifFormData({
                fullName: '',
                email: '',
                phone: '',
                date: '',
                isDateUndecided: false,
                guestCount: '',
                notes: '',
                terms: false
            });
        }, 3000);
    };

    const openTeklifModalWithPackage = (pkg) => {
        setSelectedPackage(pkg);
        setShowTeklifModal(true);
    };

    const handleCloseTeklifModal = () => {
        setShowTeklifModal(false);
        setSelectedPackage(null);
    };

    // Klavye olayları için useEffect
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightboxOpen]);

    // Lightbox açık/kapalı durumu için body overflow kontrolü
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (lightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [lightboxOpen]);

    // Gerçek uygulamada params.id ile API'den veri çekilecek

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-background">
                {/* Breadcrumb */}
                <div className="text-sm text-darkgray mb-4">
                    <a href="/" className="hover:text-primary">Anasayfa</a> {' > '}
                    <a href="/salonlar" className="hover:text-primary">Düğün Mekanları</a> {' > '}
                    <a href="/salonlar/istanbul" className="hover:text-primary">İstanbul</a> {' > '}
                    <span className="text-primary">{venue.name}</span>
                </div>

                {/* Mekan Başlığı ve Temel Bilgiler */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-text">{venue.name}</h1>
                            <p className="text-darkgray flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-1 text-darkgray" />
                                {venue.address}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                            <Button
                                variant="primary"
                                size="sm"
                                className="flex items-center text-xs sm:text-sm"
                                onClick={() => setShowRandevuModal(true)}
                            >
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="whitespace-nowrap">Randevu Al</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center text-xs sm:text-sm">
                                <Heart className="w-4 h-4 mr-1" />
                                <span className="whitespace-nowrap">Favori</span>
                            </Button>
                            <div className="flex items-center bg-white border border-border rounded-md px-2 py-1">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="font-semibold text-text">{venue.rating}</span>
                                <span className="text-xs text-darkgray ml-1">({venue.reviewCount})</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Galeri ve Teklif Formu Bölümü */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    {/* Galeri - Ekranın 2/3'ünü kaplayacak */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                            <ImageGallery
                                images={venue.images}
                                alt={venue.name}
                                height="h-60 sm:h-80 md:h-96"
                            />
                        </div>

                        {/* Mini galeri önizleme */}
                        <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {venue.images.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => openLightbox(index)}
                                >
                                    <img
                                        src={image}
                                        alt={`${venue.name} - Foto ${index + 1}`}
                                        className="w-full h-16 sm:h-20 object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Mekan Hakkında */}
                        <Card className="mt-8">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-4 text-text">Mekan Hakkında</CardTitle>
                                <p className="text-darkgray">{venue.description}</p>
                            </CardContent>
                        </Card>

                        {/* Kapasite ve Fiyat Bilgisi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <Card>
                                <CardContent className="p-6">
                                    <CardTitle className="text-lg mb-4 text-text">Kapasite</CardTitle>
                                    <p className="text-2xl font-bold text-text">{venue.capacity} <span className="text-sm font-normal">kişi</span></p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <CardTitle className="text-lg mb-4 text-text">Fiyat</CardTitle>
                                    <p className="text-2xl font-bold text-text">{venue.minPrice} TL<span className="text-sm font-normal">'den başlayan</span></p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Özellikler */}
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-4 text-text">Özellikler</CardTitle>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {venue.features.map((feature, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                            <span className="text-sm text-darkgray">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Hizmetler */}
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-4 text-text">Hizmetler</CardTitle>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {venue.services.map((service, index) => (
                                        <div key={index} className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                            <span className="text-sm text-darkgray">{service}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Paketler */}
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-4 text-text">Paketler</CardTitle>
                                <div className="space-y-6">
                                    {venue.packages.map((pkg) => (
                                        <div key={pkg.id} className="border border-gray-200 hover:border-primary rounded-lg overflow-hidden transition-colors group">
                                            <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                                <div>
                                                    <h3 className="font-semibold text-text">{pkg.name}</h3>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                                            {pkg.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-xl text-text">{pkg.price} TL</p>
                                                    <p className="text-xs text-gray-500">
                                                        {pkg.priceType === 'Kişi Başı' ? 'Kişi başı' : pkg.guestCount ? pkg.guestCount : 'Toplam fiyat'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="mb-3">
                                                    <p className="text-sm text-darkgray">{pkg.description}</p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                                    {pkg.features.map((feature, index) => (
                                                        <div key={index} className="flex items-center text-sm text-gray-600">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-primary border-primary hover:bg-primary hover:text-white"
                                                        onClick={() => openTeklifModalWithPackage(pkg)}
                                                    >
                                                        Teklif Al
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-primary border-primary hover:bg-primary hover:text-white"
                                                        onClick={() => openOnRezervasyonModal(pkg)}
                                                    >
                                                        Ön Rezervasyon
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Konumlar arasında boşluk için yeni satır */}
                        <div className="my-8"></div>

                        {/* Sorular ve Cevaplar */}
                        <Card className="mb-8">
                            <CardContent className="p-4 sm:p-6">
                                <CardTitle className="text-xl mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-text">
                                    <span>Sık Sorulan Sorular</span>
                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="flex items-center gap-1 font-medium"
                                        onClick={openSoruModal}
                                    >
                                        <span>Soru Sor</span>
                                    </Button>
                                </CardTitle>

                                {venue.questions.length === 0 ? (
                                    <p className="text-darkgray">Bu mekan için henüz soru sorulmamış.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {venue.questions.map((item) => (
                                            <div key={item.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                                                <div className="mb-3">
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <div className="bg-primary/10 text-primary p-2 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full">
                                                            <span className="font-bold">S</span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-col sm:flex-row justify-between mb-1">
                                                                <h4 className="font-medium text-text">{item.user}</h4>
                                                                <p className="text-xs text-darkgray">{item.date}</p>
                                                            </div>
                                                            <p className="text-sm text-text">{item.question}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {item.answer ? (
                                                    <div className="ml-6 sm:ml-8">
                                                        <div className="flex items-start gap-3">
                                                            <div className="bg-green-100 text-green-600 p-2 w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full">
                                                                <span className="font-bold">C</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex flex-col sm:flex-row justify-between mb-1">
                                                                    <h4 className="font-medium text-text">Mekan Yetkilisi</h4>
                                                                    <p className="text-xs text-darkgray">{item.answerDate}</p>
                                                                </div>
                                                                <p className="text-sm text-darkgray">{item.answer}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="ml-6 sm:ml-8 text-sm text-darkgray italic">
                                                        Bu soru henüz yanıtlanmamış.
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {venue.questions.length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Button variant="outline">Daha Fazla Soru Göster</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Yorumlar */}
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-4 flex items-center justify-between text-text">
                                    <span>Yorumlar</span>
                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="flex items-center gap-1 font-medium"
                                        onClick={openYorumModal}
                                    >
                                        <span>Yorum Yap</span>
                                    </Button>
                                </CardTitle>

                                {venue.comments.length === 0 ? (
                                    <p className="text-darkgray">Bu mekan için henüz yorum yapılmamış.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {venue.comments.map((comment) => (
                                            <div key={comment.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                                                <div className="flex justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-medium text-text">{comment.user || comment.name}</h4>
                                                        <p className="text-xs text-darkgray">{comment.date}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Star className="h-4 w-4 text-yellow-400" />
                                                        <span className="ml-1 text-sm font-medium text-text">{comment.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-darkgray">{comment.comment}</p>
                                            </div>
                                        ))}
                                        <div className="mt-6 flex justify-center">
                                            <Button variant="outline">Daha Fazla Yorum Göster</Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Teklif Al Formu ve İletişim - Ekranın 1/3'ünü kaplayacak */}
                    <div className="w-full lg:w-1/3">
                        <Card className="sticky top-4">
                            <CardContent className="p-4 sm:p-6">
                                <CardTitle className="text-xl mb-4 text-text">Ücretsiz Teklif Al</CardTitle>

                                <p className="text-sm text-darkgray mb-4">
                                    {venue.name} hakkında detaylı bilgi ve fiyat teklifi almak için aşağıdaki butona tıklayın.
                                </p>

                                <Button
                                    className="w-full text-sm"
                                    onClick={() => setShowTeklifModal(true)}
                                >
                                    Ücretsiz Teklif Al
                                </Button>

                                <div className="text-center mt-2 text-xs text-gray-500">
                                    24 saat içinde dönüş alacaksınız
                                </div>

                                <div className="mt-4 pt-4 border-t border-border">
                                    <Button
                                        onClick={() => setShowRandevuModal(true)}
                                        variant="outline"
                                        className="w-full flex items-center justify-center text-sm"
                                    >
                                        <Clock className="h-4 w-4 mr-2 text-primary" />
                                        Görüşme Randevusu Al
                                    </Button>
                                    <p className="text-xs text-center text-gray-500 mt-2">
                                        Mekanı görmek için randevu alabilirsiniz
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* İletişim Bilgileri */}
                        <Card className="mt-4">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-4 text-text">İletişim Bilgileri</CardTitle>

                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <MapPin className="w-5 h-5 text-primary mr-2 mt-0.5" />
                                        <span className="text-sm text-text">{venue.address}</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Phone className="w-5 h-5 text-primary mr-2" />
                                        <a href={`tel:${venue.phone}`} className="text-sm hover:text-primary text-text">{venue.phone}</a>
                                    </li>
                                </ul>

                                <div className="mt-4">
                                    <div className="aspect-w-16 aspect-h-9">
                                        {/* Google Maps iframe'i yerine statik bir harita gösterimi */}
                                        <div className="w-full h-48 rounded overflow-hidden relative">
                                            {/* Bulanık arka plan resmi */}
                                            <div className="absolute inset-0">
                                                <img
                                                    src="/images/map_photo.jpg"
                                                    alt="Harita arka planı"
                                                    className="w-full h-full object-cover filter blur-sm scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/10"></div>
                                            </div>

                                            {/* Ön plan içeriği */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                                                <MapPin className="w-8 h-8 text-white mb-2" />
                                                <div className="text-white font-medium mb-2">Haritada Görüntüle</div>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-white text-primary px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                                                >
                                                    Google Maps'te Aç
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ekiple Tanışın */}
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-6 text-text">Ekiple Tanışın</CardTitle>
                                <div className="space-y-6">
                                    {venue.team.map((member) => (
                                        <div key={member.id} className="flex flex-col sm:flex-row sm:items-start gap-4">
                                            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-text">{member.name}</h3>
                                                <p className="text-sm text-primary mb-2">{member.position}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-shrink-0 flex items-center gap-1 text-xs mt-2 sm:mt-0"
                                                    onClick={() => window.location.href = `tel:${member.phone}`}
                                                >
                                                    <Phone className="h-3 w-3" />
                                                    <span>{member.phone}</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>


                {/* Randevu Modal */}
                {showRandevuModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
                                onClick={() => setShowRandevuModal(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="p-4 sm:p-6">
                                {randevuSuccess ? (
                                    <div className="py-6 text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-text mb-2">Randevu Talebiniz Alındı</h3>
                                        <p className="text-sm text-darkgray mb-4">
                                            Randevu talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçilecektir.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-text mb-1">Randevu Al</h2>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {venue.name} ile görüşme randevusu oluşturun
                                        </p>

                                        <form className="space-y-4" onSubmit={handleRandevuSubmit}>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Ad Soyad</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={randevuFormData.fullName}
                                                    onChange={handleRandevuChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Adınız Soyadınız"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">E-posta</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={randevuFormData.email}
                                                    onChange={handleRandevuChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="E-posta adresiniz"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Telefon</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={randevuFormData.phone}
                                                    onChange={handleRandevuChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Telefon numaranız"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Tarih</label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={randevuFormData.date}
                                                    onChange={handleRandevuChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Saat</label>
                                                <input
                                                    type="time"
                                                    name="time"
                                                    value={randevuFormData.time}
                                                    onChange={handleRandevuChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Görüşme Konusu</label>
                                                <select
                                                    name="topic"
                                                    value={randevuFormData.topic}
                                                    onChange={handleRandevuChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    required
                                                >
                                                    <option value="">Seçiniz</option>
                                                    <option value="fiyat">Fiyat Bilgisi</option>
                                                    <option value="mekan">Mekan Turu</option>
                                                    <option value="paket">Paket Detayları</option>
                                                    <option value="diger">Diğer</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Notlar</label>
                                                <textarea
                                                    name="notes"
                                                    value={randevuFormData.notes}
                                                    onChange={handleRandevuChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    rows="3"
                                                    placeholder="Görüşmek istediğiniz konular..."
                                                ></textarea>
                                            </div>

                                            <div className="pt-2">
                                                <Button type="submit" className="w-full">Randevu Talep Et</Button>
                                            </div>

                                            <div className="text-center text-xs text-gray-500">
                                                Randevu talebiniz onaylandığında size e-posta ve telefon ile bilgilendirme yapılacaktır.
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Soru Sorma Modal */}
                {showSoruModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
                                onClick={() => setShowSoruModal(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="p-4 sm:p-6">
                                {soruSuccess ? (
                                    <div className="py-6 text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-text mb-2">Sorunuz Alındı</h3>
                                        <p className="text-sm text-darkgray mb-4">
                                            Sorunuz başarıyla alınmıştır. En kısa sürede yanıtlanacaktır.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-text mb-1">Soru Sor</h2>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {venue.name} hakkında merak ettiğiniz soruyu yazın
                                        </p>

                                        <form className="space-y-4" onSubmit={handleSoruSubmit}>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Sorunuz</label>
                                                <textarea
                                                    value={soruData}
                                                    onChange={handleSoruChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    rows="5"
                                                    placeholder="Sorunuzu buraya yazabilirsiniz..."
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="pt-2">
                                                <Button type="submit" className="w-full">Soru Gönder</Button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Yorum Yapma Modal */}
                {showYorumModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
                                onClick={() => setShowYorumModal(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="p-4 sm:p-6">
                                {yorumSuccess ? (
                                    <div className="py-6 text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-text mb-2">Yorumunuz Alındı</h3>
                                        <p className="text-sm text-darkgray mb-4">
                                            Yorumunuz başarıyla kaydedilmiştir. Teşekkür ederiz!
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-text mb-1">Yorum Yap</h2>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {venue.name} hakkındaki deneyiminizi paylaşın
                                        </p>

                                        <form className="space-y-5" onSubmit={handleYorumSubmit}>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Puanınız</label>
                                                <div className="flex items-center gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => handleRatingChange(star)}
                                                            className="focus:outline-none transition-colors"
                                                        >
                                                            <Star
                                                                className={`h-8 w-8 ${star <= yorumData.rating
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                                {yorumData.rating === 0 && (
                                                    <p className="text-xs text-red-500 mt-1">Lütfen bir puan verin</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Yorumunuz</label>
                                                <textarea
                                                    name="comment"
                                                    value={yorumData.comment}
                                                    onChange={handleYorumChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    rows="5"
                                                    placeholder="Deneyiminizi anlatın..."
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="pt-2">
                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled={yorumData.rating === 0}
                                                >
                                                    Yorumu Gönder
                                                </Button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Ön Rezervasyon Modal */}
                {showOnRezervasyonModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
                                onClick={() => setShowOnRezervasyonModal(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="p-4 sm:p-6">
                                {onRezervasyonSuccess ? (
                                    <div className="py-6 text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-text mb-2">Ön Rezervasyon Talebiniz Alındı</h3>
                                        <p className="text-sm text-darkgray mb-4">
                                            Ön rezervasyon talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçilecektir.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-text mb-1">Ön Rezervasyon</h2>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {venue.name} - {selectedPackage?.name}
                                        </p>

                                        <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-primary">Paket Fiyatı</p>
                                                    <p className="text-xs text-gray-500">{selectedPackage?.priceType}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-lg text-text">{selectedPackage?.price} TL</p>
                                                </div>
                                            </div>
                                        </div>

                                        <form className="space-y-4" onSubmit={handleOnRezervasyonSubmit}>
                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Ad Soyad</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={onRezervasyonData.fullName}
                                                    onChange={handleOnRezervasyonChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Adınız Soyadınız"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">E-posta</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={onRezervasyonData.email}
                                                    onChange={handleOnRezervasyonChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    placeholder="E-posta adresiniz"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Telefon</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={onRezervasyonData.phone}
                                                    onChange={handleOnRezervasyonChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    placeholder="05XX XXX XX XX"
                                                    required
                                                />
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium mb-1 text-text">Tarih</label>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            name="date"
                                                            value={onRezervasyonData.date}
                                                            onChange={handleOnRezervasyonChange}
                                                            className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                            required
                                                        />
                                                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium mb-1 text-text">Kişi Sayısı</label>
                                                    <div className="relative">
                                                        <select
                                                            name="guestCount"
                                                            value={onRezervasyonData.guestCount}
                                                            onChange={handleOnRezervasyonChange}
                                                            className="w-full p-3 border border-gray-300 rounded-md text-sm appearance-none"
                                                            required
                                                        >
                                                            <option value="">Seçiniz</option>
                                                            <option value="50-100">50-100</option>
                                                            <option value="100-200">100-200</option>
                                                            <option value="200-300">200-300</option>
                                                            <option value="300-500">300-500</option>
                                                            <option value="500+">500+</option>
                                                        </select>
                                                        <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Notlar (Opsiyonel)</label>
                                                <textarea
                                                    name="notes"
                                                    value={onRezervasyonData.notes}
                                                    onChange={handleOnRezervasyonChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    rows="3"
                                                    placeholder="Eklemek istediğiniz detaylar..."
                                                ></textarea>
                                            </div>

                                            <div className="pt-2">
                                                <Button type="submit" className="w-full">Ön Rezervasyon Yap</Button>
                                            </div>

                                            <p className="text-xs text-center text-gray-500">
                                                Ön rezervasyon yapmak ücretsizdir ve herhangi bir yükümlülük gerektirmez.
                                            </p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Teklif Alma Modal */}
                {showTeklifModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4"
                        onClick={(e) => {
                            // Modal dışına tıklanırsa modalı kapat
                            if (e.target === e.currentTarget) {
                                handleCloseTeklifModal();
                            }
                        }}
                    >
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
                                onClick={handleCloseTeklifModal}
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="p-4 sm:p-6">
                                {teklifSuccess ? (
                                    <div className="py-6 text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <svg className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-text mb-2">Teklif Talebiniz Alındı</h3>
                                        <p className="text-sm text-darkgray mb-4">
                                            Teklif talebiniz başarıyla alınmıştır. 24 saat içinde sizinle iletişime geçilecektir.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-xl font-bold text-text mb-1">Ücretsiz Teklif Al</h2>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {venue.name}{selectedPackage ? ` - ${selectedPackage.name}` : ''}
                                        </p>

                                        <form className="space-y-4" onSubmit={handleTeklifSubmit}>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Paket Seçimi</label>
                                                {selectedPackage ? (
                                                    <div className="bg-primary/5 border border-primary/20 rounded-md p-3 hover:bg-primary/10 cursor-pointer transition-colors"
                                                        onClick={() => setSelectedPackage(null)}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <p className="text-sm font-medium text-primary">{selectedPackage.name}</p>
                                                                <p className="text-xs text-gray-500">{selectedPackage.type} | {selectedPackage.priceType}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-lg text-text">{selectedPackage.price} TL</p>
                                                                <button
                                                                    type="button"
                                                                    className="text-xs text-primary underline"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedPackage(null);
                                                                    }}
                                                                >
                                                                    Değiştir
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <select
                                                        name="packageSelect"
                                                        className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                        onChange={(e) => {
                                                            const selectedId = parseInt(e.target.value);
                                                            if (selectedId) {
                                                                const pkg = venue.packages.find(p => p.id === selectedId);
                                                                setSelectedPackage(pkg);
                                                            } else {
                                                                setSelectedPackage(null);
                                                            }
                                                        }}
                                                        value={selectedPackage?.id || ""}
                                                    >
                                                        <option value="">Paket seçiniz (opsiyonel)</option>
                                                        {venue.packages.map((pkg) => (
                                                            <option key={pkg.id} value={pkg.id}>
                                                                {pkg.name} - {pkg.price} TL ({pkg.priceType})
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Ad Soyad</label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={teklifFormData.fullName}
                                                    onChange={handleTeklifChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Adınız Soyadınız"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">E-posta</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={teklifFormData.email}
                                                    onChange={handleTeklifChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    placeholder="E-posta adresiniz"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Telefon</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={teklifFormData.phone}
                                                    onChange={handleTeklifChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    placeholder="Telefon numaranız"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-sm font-medium mb-1 text-text">Davet Tarihi</label>
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="dateNotDecided"
                                                            name="isDateUndecided"
                                                            checked={teklifFormData.isDateUndecided}
                                                            onChange={handleTeklifChange}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor="dateNotDecided" className="text-xs text-gray-600">
                                                            Henüz belli değil
                                                        </label>
                                                    </div>
                                                </div>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={teklifFormData.date}
                                                    onChange={handleTeklifChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    disabled={teklifFormData.isDateUndecided}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Misafir Sayısı</label>
                                                <select
                                                    name="guestCount"
                                                    value={teklifFormData.guestCount}
                                                    onChange={handleTeklifChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    required
                                                >
                                                    <option value="">Seçiniz</option>
                                                    <option value="0-50">0-50 kişi</option>
                                                    <option value="51-100">51-100 kişi</option>
                                                    <option value="101-200">101-200 kişi</option>
                                                    <option value="201-500">201-500 kişi</option>
                                                    <option value="500+">500+ kişi</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1 text-text">Mesajınız (İsteğe bağlı)</label>
                                                <textarea
                                                    name="notes"
                                                    value={teklifFormData.notes}
                                                    onChange={handleTeklifChange}
                                                    className="w-full p-3 border border-gray-300 rounded-md text-sm"
                                                    rows="3"
                                                    placeholder="Mesajınızı buraya yazabilirsiniz..."
                                                ></textarea>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    name="terms"
                                                    checked={teklifFormData.terms}
                                                    onChange={handleTeklifChange}
                                                    className="mr-2"
                                                    required
                                                />
                                                <label htmlFor="terms" className="text-xs text-gray-600">
                                                    Kişisel bilgilerimin düğün salonu ile paylaşılmasını onaylıyorum.
                                                </label>
                                            </div>

                                            <div className="pt-2">
                                                <Button type="submit" className="w-full text-sm">Ücretsiz Teklif Al</Button>
                                            </div>

                                            <p className="text-xs text-center text-gray-500">
                                                24 saat içinde dönüş alacaksınız
                                            </p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Benzer Mekanlar */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-text">Benzer Mekanlar</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venue.similarVenues.map((venue) => (
                            <Card key={venue.id} className="overflow-hidden">
                                <div className="relative h-48">
                                    <img
                                        src={venue.image}
                                        alt={venue.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-text">{venue.name}</h3>
                                        </div>
                                        <p className="font-bold text-text">{venue.price} TL</p>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <Button variant="link" size="sm" className="text-primary p-0">
                                            Detayları Gör <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
} 