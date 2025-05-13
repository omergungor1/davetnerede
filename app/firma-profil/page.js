"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageGallery } from '../../components/ui/image-gallery';
import { Button } from '../../components/ui/button';

export default function FirmaProfil() {
    const [activeTab, setActiveTab] = useState('bilgiler');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const router = useRouter();

    // Örnek firma verileri
    const [firmaData, setFirmaData] = useState({
        id: 1,
        adi: 'Mövenpick Hotel İstanbul Asia Airport',
        email: 'info@movenpick.com',
        telefon: '0216 666 64 64',
        adres: 'Fatih Sultan Mehmet Mahallesi, Balkan Caddesi No:58, 34770 Ümraniye/İstanbul',
        kurulusTarihi: '2010',
        paket: 'Premium',
        aciklama: 'Modern ve ihtişamlı atmosferiyle Mövenpick Hotel İstanbul Asia Airport, hayalinizdeki düğün için mükemmel bir mekan. Geniş salonları, profesyonel hizmet anlayışı ve lezzetli menüleriyle unutulmaz bir düğün deneyimi yaşamanızı sağlar.',
        sosyalMedya: {
            instagram: 'movenpickistanbul',
            facebook: 'movenpickhotelasia',
            twitter: 'movenpickist'
        },
        fotolar: [
            '/images/salon-1.webp',
            '/images/salon-2.webp',
            '/images/salon-4.webp',
            '/images/salon-6.webp',
        ],
        kapakresimiIndex: 0,
        rezervasyonlar: [
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
        sorular: [
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
    });

    // Firma bilgilerini güncelleme
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Eğer sosyal medya alanlarını güncelliyorsak
        if (name.startsWith('sosyal_')) {
            const platform = name.split('_')[1];
            setFirmaData(prev => ({
                ...prev,
                sosyalMedya: {
                    ...prev.sosyalMedya,
                    [platform]: value
                }
            }));
        } else {
            setFirmaData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Profil düzenleme formunu gönderme
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Güncellenmiş firma bilgileri:', firmaData);

        // Burada API çağrısı yapılabilir

        // Düzenleme modundan çık
        setIsEditing(false);
    };

    const handleLogout = () => {
        // Çıkış işlemleri burada yapılacak
        router.push('/firmalar-icin');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center">
                        <Image src="/images/logo.png" alt="Davet Evi Bul Logo" width={36} height={36} />
                        <span className="text-lg sm:text-xl font-bold text-primary ml-2">Davet Evi Bul</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-700">
                            <span className="font-medium">{firmaData.adi}</span>
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {firmaData.paket}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-xs sm:text-sm border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100"
                        >
                            Çıkış
                        </button>
                    </div>
                </div>
            </header>

            {/* Ana İçerik */}
            <main className="container mx-auto px-4 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b">
                        <nav className="flex">
                            <button
                                className={`px-4 py-3 text-sm font-medium ${activeTab === 'bilgiler' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('bilgiler')}
                            >
                                Firma Bilgileri
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium ${activeTab === 'fotolar' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('fotolar')}
                            >
                                Fotoğraflar
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium ${activeTab === 'rezervasyonlar' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('rezervasyonlar')}
                            >
                                Rezervasyonlar
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium ${activeTab === 'sorular' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('sorular')}
                            >
                                Sorular
                            </button>
                        </nav>
                    </div>

                    {/* Tab İçerikleri */}
                    <div className="p-6">
                        {/* Profil Tab */}
                        {activeTab === 'bilgiler' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Firma Bilgileri</h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                                    >
                                        {isEditing ? 'İptal' : 'Düzenle'}
                                    </button>
                                </div>

                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label htmlFor="adi" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Firma Adı
                                                </label>
                                                <input
                                                    type="text"
                                                    id="adi"
                                                    name="adi"
                                                    value={firmaData.adi}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    E-posta
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={firmaData.email}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Telefon
                                                </label>
                                                <input
                                                    type="text"
                                                    id="telefon"
                                                    name="telefon"
                                                    value={firmaData.telefon}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="adres" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Adres
                                                </label>
                                                <input
                                                    type="text"
                                                    id="adres"
                                                    name="adres"
                                                    value={firmaData.adres}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="kurulusTarihi" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Kuruluş Yılı
                                                </label>
                                                <input
                                                    type="text"
                                                    id="kurulusTarihi"
                                                    name="kurulusTarihi"
                                                    value={firmaData.kurulusTarihi}
                                                    onChange={handleChange}
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="aciklama" className="block text-sm font-medium text-gray-700 mb-1">
                                                Firma Açıklaması
                                            </label>
                                            <textarea
                                                id="aciklama"
                                                name="aciklama"
                                                rows="4"
                                                value={firmaData.aciklama}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                            ></textarea>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label htmlFor="sosyal_instagram" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Instagram
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                                        @
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="sosyal_instagram"
                                                        name="sosyal_instagram"
                                                        value={firmaData.sosyalMedya.instagram}
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-md p-2 pl-8 text-sm focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="sosyal_facebook" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Facebook
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                                        /
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="sosyal_facebook"
                                                        name="sosyal_facebook"
                                                        value={firmaData.sosyalMedya.facebook}
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-md p-2 pl-8 text-sm focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="sosyal_twitter" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Twitter
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                                        @
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="sosyal_twitter"
                                                        name="sosyal_twitter"
                                                        value={firmaData.sosyalMedya.twitter}
                                                        onChange={handleChange}
                                                        className="w-full border border-gray-300 rounded-md p-2 pl-8 text-sm focus:ring-primary focus:border-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
                                            >
                                                Kaydet
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Firma Adı</h3>
                                                <p className="mt-1 text-sm text-gray-900">{firmaData.adi}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">E-posta</h3>
                                                <p className="mt-1 text-sm text-gray-900">{firmaData.email}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Telefon</h3>
                                                <p className="mt-1 text-sm text-gray-900">{firmaData.telefon}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Adres</h3>
                                                <p className="mt-1 text-sm text-gray-900">{firmaData.adres}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Kuruluş Yılı</h3>
                                                <p className="mt-1 text-sm text-gray-900">{firmaData.kurulusTarihi}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Üyelik Paketi</h3>
                                                <p className="mt-1 text-sm">
                                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                        {firmaData.paket}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Firma Açıklaması</h3>
                                            <p className="mt-1 text-sm text-gray-900">{firmaData.aciklama}</p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Sosyal Medya</h3>
                                            <div className="mt-1 flex items-center space-x-4">
                                                {firmaData.sosyalMedya.instagram && (
                                                    <a href={`https://instagram.com/${firmaData.sosyalMedya.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                        @{firmaData.sosyalMedya.instagram}
                                                    </a>
                                                )}
                                                {firmaData.sosyalMedya.facebook && (
                                                    <a href={`https://facebook.com/${firmaData.sosyalMedya.facebook}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                        /{firmaData.sosyalMedya.facebook}
                                                    </a>
                                                )}
                                                {firmaData.sosyalMedya.twitter && (
                                                    <a href={`https://twitter.com/${firmaData.sosyalMedya.twitter}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                        @{firmaData.sosyalMedya.twitter}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Fotoğraflar Tab */}
                        {activeTab === 'fotolar' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Salon Fotoğrafları</h2>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="fotograf-yukle" className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 cursor-pointer">
                                            Fotoğraf Ekle
                                        </label>
                                        <input
                                            id="fotograf-yukle"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                // Burada fotoğraf yükleme işlemi gerçekleşecek
                                                if (e.target.files && e.target.files[0]) {
                                                    const reader = new FileReader();
                                                    reader.onload = (upload) => {
                                                        const newPhotos = [...firmaData.fotolar, upload.target.result];
                                                        setFirmaData({
                                                            ...firmaData,
                                                            fotolar: newPhotos
                                                        });
                                                    };
                                                    reader.readAsDataURL(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Galeri - Ekranın 2/3'ünü kaplayacak */}
                                    <div className="w-full lg:w-2/3">
                                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                                            <ImageGallery
                                                images={firmaData.fotolar}
                                                alt={firmaData.adi}
                                                height="h-96"
                                            />
                                        </div>

                                        {firmaData.fotolar.length === 0 && (
                                            <div className="bg-gray-50 p-8 text-center rounded-lg">
                                                <p className="text-gray-500">Henüz fotoğraf eklenmemiş.</p>
                                            </div>
                                        )}

                                        {/* Fotoğraf Yönetimi */}
                                        <div className="mt-6">
                                            <h3 className="text-lg font-medium mb-4">Fotoğraf Yönetimi</h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                {firmaData.fotolar.map((foto, index) => (
                                                    <div
                                                        key={index}
                                                        className={`relative rounded-lg overflow-hidden border-2 ${index === firmaData.kapakresimiIndex ? 'border-primary' : 'border-transparent'} hover:border-gray-300 transition-colors cursor-pointer group`}
                                                        onClick={() => {
                                                            setSelectedImage(index);
                                                            setShowImageOptions(true);
                                                        }}
                                                    >
                                                        <div className="aspect-w-1 aspect-h-1">
                                                            <Image
                                                                src={foto}
                                                                alt={`${firmaData.adi} - Foto ${index + 1}`}
                                                                width={200}
                                                                height={200}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>

                                                        {/* Kapak resmi işareti */}
                                                        {index === firmaData.kapakresimiIndex && (
                                                            <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                                                                Kapak
                                                            </div>
                                                        )}

                                                        {/* Resim üzerine gelince çıkan işlem butonları */}
                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="flex gap-1">
                                                                <button
                                                                    className="bg-white text-gray-800 p-1 rounded-full hover:bg-gray-200"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setFirmaData({
                                                                            ...firmaData,
                                                                            kapakresimiIndex: index
                                                                        });
                                                                    }}
                                                                    title="Kapak resmi yap"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    className="bg-white text-red-500 p-1 rounded-full hover:bg-gray-200"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const newPhotos = [...firmaData.fotolar];
                                                                        newPhotos.splice(index, 1);

                                                                        let newKapakIndex = firmaData.kapakresimiIndex;
                                                                        if (index === firmaData.kapakresimiIndex) {
                                                                            newKapakIndex = 0;
                                                                        } else if (index < firmaData.kapakresimiIndex) {
                                                                            newKapakIndex = Math.max(0, newKapakIndex - 1);
                                                                        }

                                                                        setFirmaData({
                                                                            ...firmaData,
                                                                            fotolar: newPhotos,
                                                                            kapakresimiIndex: newKapakIndex
                                                                        });
                                                                    }}
                                                                    title="Fotoğrafı sil"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Fotoğraf bilgileri */}
                                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Toplam {firmaData.fotolar.length} fotoğraf</span>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-500">En iyi görünüm için kare (1:1) veya yatay (16:9) fotoğraflar yükleyin</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sıralama Uarıları */}
                                        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                                            <h3 className="text-sm font-medium text-blue-800 mb-2">İpuçları:</h3>
                                            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                                                <li>Kapak fotoğrafınız, mekanınızın profilinde ve arama sonuçlarında görünen ana fotoğraftır.</li>
                                                <li>En kaliteli, mekanınızı en iyi yansıtan fotoğrafı kapak olarak seçin.</li>
                                                <li>Fotoğraflarınızı yüksek çözünürlüklü ve iyi aydınlatılmış olarak yükleyin.</li>
                                                <li>Mümkünse profesyonel çekimler kullanın.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Sağ Kısım - İpuçları ve Bilgiler */}
                                    <div className="w-full lg:w-1/3">
                                        <div className="bg-white shadow-sm rounded-lg p-4">
                                            <h3 className="font-medium text-lg mb-3">Fotoğraf Yükleme Rehberi</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium text-sm text-gray-800 mb-1">Mekan Fotoğrafları:</h4>
                                                    <p className="text-sm text-gray-600">Mekanınızın iç ve dış görünümü, salon düzeni, masa düzeni, özel alanlar, manzara vs.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm text-gray-800 mb-1">Yemek Fotoğrafları:</h4>
                                                    <p className="text-sm text-gray-600">Sunduğunuz yemekler, büfe örnekleri, pasta ve ikramlar.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm text-gray-800 mb-1">Organizasyon Fotoğrafları:</h4>
                                                    <p className="text-sm text-gray-600">Düğün, nişan, kına vb. organizasyonlardan görseller.</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm text-gray-800 mb-1">Detay Fotoğrafları:</h4>
                                                    <p className="text-sm text-gray-600">Masa süslemeleri, çiçek düzenlemeleri, ışıklandırma detayları.</p>
                                                </div>

                                                <div className="border-t pt-4 mt-4">
                                                    <h4 className="font-medium text-sm text-gray-800 mb-2">Önerilen Boyutlar:</h4>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        <li>• En az 1000x750 piksel çözünürlük</li>
                                                        <li>• Yatay formatlar tercih edilmeli</li>
                                                        <li>• Maksimum dosya boyutu: 5MB</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Rezervasyonlar Tab */}
                        {activeTab === 'rezervasyonlar' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Rezervasyon Talepleri</h2>
                                    <div className="flex items-center gap-3">
                                        <select className="border border-gray-300 rounded-md text-sm p-2">
                                            <option value="all">Tüm Talepler</option>
                                            <option value="pending">Bekleyen</option>
                                            <option value="approved">Onaylanan</option>
                                            <option value="rejected">Reddedilen</option>
                                        </select>
                                    </div>
                                </div>

                                {firmaData.rezervasyonlar.length === 0 ? (
                                    <div className="bg-gray-50 p-8 text-center rounded-lg">
                                        <p className="text-gray-500">Henüz rezervasyon talebi bulunmuyor.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {firmaData.rezervasyonlar.map((rezervasyon) => (
                                            <div key={rezervasyon.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                                                <div className="p-4 border-b">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{rezervasyon.name}</h3>
                                                            <p className="text-xs text-gray-500 mt-1">Talep Tarihi: {rezervasyon.createdAt}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rezervasyon.status === 'onaylandı'
                                                                ? 'bg-green-100 text-green-800'
                                                                : rezervasyon.status === 'reddedildi'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {rezervasyon.status === 'onaylandı'
                                                                    ? 'Onaylandı'
                                                                    : rezervasyon.status === 'reddedildi'
                                                                        ? 'Reddedildi'
                                                                        : 'Beklemede'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Organizasyon Tarihi</p>
                                                            <p className="text-sm font-medium">{rezervasyon.date}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Misafir Sayısı</p>
                                                            <p className="text-sm font-medium">{rezervasyon.guestCount} kişi</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">İletişim</p>
                                                            <p className="text-sm">
                                                                <a href={`tel:${rezervasyon.phone}`} className="text-primary hover:underline">{rezervasyon.phone}</a>
                                                            </p>
                                                            <p className="text-sm">
                                                                <a href={`mailto:${rezervasyon.email}`} className="text-primary hover:underline">{rezervasyon.email}</a>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Mesaj</p>
                                                        <p className="text-sm">{rezervasyon.message}</p>
                                                    </div>

                                                    {rezervasyon.status === 'beklemede' && (
                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50">
                                                                Reddet
                                                            </button>
                                                            <button className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90">
                                                                Onayla
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Sorular Tab */}
                        {activeTab === 'sorular' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Müşteri Soruları</h2>
                                    <div className="flex items-center gap-3">
                                        <select className="border border-gray-300 rounded-md text-sm p-2">
                                            <option value="all">Tüm Sorular</option>
                                            <option value="answered">Yanıtlanan</option>
                                            <option value="unanswered">Yanıtlanmayan</option>
                                        </select>
                                    </div>
                                </div>

                                {firmaData.sorular.length === 0 ? (
                                    <div className="bg-gray-50 p-8 text-center rounded-lg">
                                        <p className="text-gray-500">Henüz soru bulunmuyor.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {firmaData.sorular.map((soru) => (
                                            <div key={soru.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                                                <div className="p-4 border-b">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{soru.user}</h3>
                                                            <p className="text-xs text-gray-500 mt-1">Soru Tarihi: {soru.date}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${soru.answer ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {soru.answer ? 'Yanıtlandı' : 'Yanıt Bekliyor'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Soru</p>
                                                        <p className="text-sm font-medium">{soru.question}</p>
                                                    </div>

                                                    {soru.answer ? (
                                                        <div className="mt-3 pt-3 border-t">
                                                            <p className="text-xs text-gray-500 mb-1">Yanıtınız ({soru.answerDate})</p>
                                                            <p className="text-sm">{soru.answer}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-3 pt-3 border-t">
                                                            <p className="text-xs text-gray-500 mb-1">Yanıtınız</p>
                                                            <textarea
                                                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                                                rows="3"
                                                                placeholder="Soruyu yanıtlayın..."
                                                            ></textarea>
                                                            <div className="flex justify-end mt-2">
                                                                <button className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90">
                                                                    Yanıtı Gönder
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 