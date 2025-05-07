"use client";

import { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardTitle } from '../../../components/ui/card';
import { Star, Heart, MapPin, Phone, Mail, Clock, ChevronRight, CheckCircle, X } from 'lucide-react';


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
    email: 'info@movenpick.com',
    website: 'www.movenpick.com',
    workingHours: '09:00 - 23:00',
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
            name: 'Hafta İçi Yemekli',
            price: 2000,
            description: 'Hafta içi saat 12:00-17:00 arası geçerli,menü dahil.'
        },
        {
            id: 2,
            name: 'Hafta Sonu',
            price: 2500,
            description: 'Cumartesi-Pazar günleri saat 12:00-18:00 arası geçerli, menü dahil.'
        },
        {
            id: 3,
            name: 'Koktely',
            price: 1350,
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
    ]
};

export default function VenueDetail({ params }) {
    // Resim galerisi için state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const openLightbox = (index) => {
        setActiveImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % venue.images.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prevIndex) => (prevIndex - 1 + venue.images.length) % venue.images.length);
    };

    // Klavye olayları için useEffect
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightboxOpen]);

    // Gerçek uygulamada params.id ile API'den veri çekilecek

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 bg-background">
                {/* Breadcrumb */}
                <div className="text-sm text-darkgray mb-4">
                    <a href="/" className="hover:text-primary">Anasayfa</a> {' > '}
                    <a href="/dugun-mekanlari" className="hover:text-primary">Düğün Mekanları</a> {' > '}
                    <a href="/dugun-mekanlari/istanbul" className="hover:text-primary">İstanbul</a> {' > '}
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
                        <div className="flex items-center flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="flex items-center">
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

                {/* Galeri */}
                <div className="grid grid-cols-4 gap-2 mb-8">
                    <div className="col-span-2 row-span-2 cursor-pointer" onClick={() => openLightbox(0)}>
                        <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover rounded-l-lg" />
                    </div>
                    <div className="cursor-pointer" onClick={() => openLightbox(1)}>
                        <img src={venue.images[1]} alt={venue.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="cursor-pointer" onClick={() => openLightbox(2)}>
                        <img src={venue.images[2]} alt={venue.name} className="w-full h-full object-cover rounded-tr-lg" />
                    </div>
                    <div className="cursor-pointer" onClick={() => openLightbox(1)}>
                        <img src={venue.images[1]} alt={venue.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="cursor-pointer" onClick={() => openLightbox(3)}>
                        <img src={venue.images[3]} alt={venue.name} className="w-full h-full object-cover rounded-br-lg" />
                    </div>
                </div>

                {/* Lightbox */}
                {lightboxOpen && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
                        <div className="relative w-full max-w-4xl mx-auto px-4">
                            <button
                                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                                onClick={closeLightbox}
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div className="relative">
                                <img
                                    src={venue.images[activeImageIndex]}
                                    alt={`${venue.name} - Görsel ${activeImageIndex + 1}`}
                                    className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                                />

                                <button
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-r-md"
                                    onClick={prevImage}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <button
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-l-md"
                                    onClick={nextImage}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <div className="text-center text-white mt-2">
                                {activeImageIndex + 1} / {venue.images.length}
                            </div>

                            {/* Thumbnail gallery */}
                            <div className="flex justify-center mt-4 gap-2 overflow-x-auto py-2 max-w-full">
                                {venue.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden focus:outline-none ${index === activeImageIndex
                                            ? 'ring-2 ring-primary border border-primary'
                                            : 'opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <div className="inline-flex bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-white">
                                <button onClick={closeLightbox} className="hover:text-primary transition-colors">
                                    Galeriden Çık (ESC)
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ana İçerik */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sol İçerik */}
                    <div className="lg:w-2/3">
                        {/* Açıklama */}
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-4 text-text">Mekan Hakkında</CardTitle>
                                <p className="text-text mb-4">{venue.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    <div>
                                        <h3 className="font-semibold mb-2 text-text">Özellikler</h3>
                                        <ul className="space-y-1">
                                            {venue.features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-primary mr-2" />
                                                    <span className="text-sm text-text">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2 text-text">Hizmetler</h3>
                                        <ul className="space-y-1">
                                            {venue.services.map((service, index) => (
                                                <li key={index} className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-primary mr-2" />
                                                    <span className="text-sm text-text">{service}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Paketler */}
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-4 text-text">Mövenpick Hotel İstanbul Asia Airport Düğün Fiyatları</CardTitle>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {venue.packages.map((pkg) => (
                                        <div key={pkg.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-text">{pkg.name}</h3>
                                                <div>
                                                    <div className="text-xs text-darkgray">Kişi Başı</div>
                                                    <div className="font-bold text-lg text-text">{pkg.price} TL</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-darkgray">{pkg.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-center">
                                    <Button>Detaylı Teklif Al</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Yorumlar */}
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <CardTitle className="text-xl text-text">Müşteri Yorumları</CardTitle>
                                    <div className="flex items-center">
                                        <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                        <span className="text-lg font-semibold text-text">{venue.rating}</span>
                                        <span className="text-sm text-darkgray ml-1">({venue.reviewCount})</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {venue.comments.map((comment) => (
                                        <div key={comment.id} className="border-b pb-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium text-text">{comment.user}</span>
                                                <span className="text-sm text-darkgray">{comment.date}</span>
                                            </div>
                                            <div className="flex items-center mb-2">
                                                <Star className="h-4 w-4 text-yellow-400" />
                                                <span className="text-sm ml-1 text-text">{comment.rating}</span>
                                            </div>
                                            <p className="text-darkgray text-sm">{comment.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Benzer Mekanlar */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <CardTitle className="text-xl text-text">Benzer Mekanlar</CardTitle>
                                    <a href="#" className="text-primary text-sm flex items-center">
                                        Tümünü gör
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </a>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {venue.similarVenues.map((item) => (
                                        <div key={item.id} className="border rounded-lg overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-32 object-cover" />
                                            <div className="p-3">
                                                <h3 className="font-medium text-text mb-1">{item.name}</h3>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="text-xs text-darkgray">Kişi Başı</div>
                                                        <div className="font-semibold text-text">{item.price} TL</div>
                                                    </div>
                                                    <Button size="sm" variant="outline">İncele</Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sağ Sidebar */}
                    <div className="lg:w-1/3">
                        {/* Teklif Al Formu */}
                        <Card className="mb-6 sticky top-4">
                            <CardContent className="p-6">
                                <CardTitle className="text-xl mb-4 text-text">Ücretsiz Teklif Al</CardTitle>

                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text">Adınız Soyadınız</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Adınız Soyadınız"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text">E-posta</label>
                                        <input
                                            type="email"
                                            className="w-full p-2 border rounded-md"
                                            placeholder="E-posta adresiniz"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text">Telefon</label>
                                        <input
                                            type="tel"
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Telefon numaranız"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text">Düğün Tarihi</label>
                                        <input
                                            type="date"
                                            className="w-full p-2 border rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text">Misafir Sayısı</label>
                                        <select className="w-full p-2 border rounded-md">
                                            <option>Seçiniz</option>
                                            <option>0-50 kişi</option>
                                            <option>51-100 kişi</option>
                                            <option>101-200 kişi</option>
                                            <option>201-500 kişi</option>
                                            <option>500+ kişi</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-text">Düğün Türü</label>
                                        <select className="w-full p-2 border rounded-md">
                                            <option>Seçiniz</option>
                                            <option>Gece Düğünü</option>
                                            <option>Gündüz Düğünü</option>
                                            <option>Kına Gecesi</option>
                                            <option>Nişan Töreni</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center">
                                        <input type="checkbox" id="terms" className="mr-2" />
                                        <label htmlFor="terms" className="text-xs text-darkgray">
                                            Kişisel bilgilerimin düğün salonuyla paylaşılmasını onaylıyorum.
                                        </label>
                                    </div>

                                    <Button className="w-full">Ücretsiz Teklif Al</Button>
                                </form>

                                <div className="text-center mt-4 text-sm text-darkgray">
                                    24 saat içinde dönüş alacaksınız
                                </div>
                            </CardContent>
                        </Card>

                        {/* İletişim Bilgileri */}
                        <Card>
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
                                    <li className="flex items-center">
                                        <Mail className="w-5 h-5 text-primary mr-2" />
                                        <a href={`mailto:${venue.email}`} className="text-sm hover:text-primary text-text">{venue.email}</a>
                                    </li>
                                    <li className="flex items-center">
                                        <Clock className="w-5 h-5 text-primary mr-2" />
                                        <span className="text-sm text-text">{venue.workingHours}</span>
                                    </li>
                                </ul>

                                <div className="mt-4">
                                    <div className="aspect-w-16 aspect-h-9">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12041.468653376351!2d29.1028!3d41.0165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAyJzM5LjAiTiAyOcKwMDUnMzAuMCJF!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str"
                                            className="w-full h-48 border-0 rounded"
                                            allowFullScreen=""
                                            loading="lazy"
                                            title="Konum"
                                        ></iframe>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 