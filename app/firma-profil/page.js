"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/auth-context';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Edit, UserCheck, MapPin, Phone, Mail, X, Download, ExternalLink, Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import turkiyeIlIlce from '@/data/turkiye-il-ilce';
import { CallMeForm } from '@/components/ui/call-me-form';

export default function FirmaProfilPage() {
    const router = useRouter();
    const { user, isCompanyAccount, signOut } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [firmaProfil, setFirmaProfil] = useState({
        firma_adi: '',
        email: '',
        telefon: '',
        website: '',
        adres: '',
        il_id: null,
        il_adi: '',
        ilce_id: null,
        ilce_adi: '',
        aciklama: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [ilceler, setIlceler] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Mock veriler
    const mockTeklifler = [
        { id: 1, musteri: "Ahmet Yılmaz", tarih: "12.08.2023", durum: "Beklemede", tutar: 12500 },
        { id: 2, musteri: "Zeynep Kaya", tarih: "05.09.2023", durum: "Onaylandı", tutar: 15800 },
        { id: 3, musteri: "Mehmet Demir", tarih: "18.09.2023", durum: "İptal Edildi", tutar: 8750 },
        { id: 4, musteri: "Ayşe Çelik", tarih: "22.09.2023", durum: "Beklemede", tutar: 22000 },
        { id: 5, musteri: "Fatma Şahin", tarih: "01.10.2023", durum: "Onaylandı", tutar: 18500 }
    ];

    const mockRezervasyon = [
        { id: 1, musteri: "Ali Veli", tarih: "15.11.2023", misafirSayisi: 250, odemeDurumu: "Kapora Alındı", tutar: 35000 },
        { id: 2, musteri: "Hande Doğan", tarih: "22.12.2023", misafirSayisi: 120, odemeDurumu: "Tamamı Ödendi", tutar: 22000 },
        { id: 3, musteri: "Serkan Öz", tarih: "05.01.2024", misafirSayisi: 180, odemeDurumu: "Kapora Alındı", tutar: 28500 },
        { id: 4, musteri: "Ece Güneş", tarih: "14.02.2024", misafirSayisi: 300, odemeDurumu: "Beklemede", tutar: 42000 }
    ];

    const mockRandevular = [
        { id: 1, musteri: "Selin Öztürk", tarih: "08.10.2023", saat: "14:30", amac: "Mekan Görüşmesi", durum: "Tamamlandı" },
        { id: 2, musteri: "Hakan Demirci", tarih: "12.10.2023", saat: "11:00", amac: "Menü Tadımı", durum: "Beklemede" },
        { id: 3, musteri: "Nihan Aktaş", tarih: "15.10.2023", saat: "16:00", amac: "Fiyat Görüşmesi", durum: "Beklemede" },
        { id: 4, musteri: "Berk Yıldız", tarih: "18.10.2023", saat: "10:30", amac: "Dekorasyon Planlaması", durum: "İptal Edildi" }
    ];

    const mockSorular = [
        { id: 1, musteri: "Ceyda Kılıç", tarih: "01.10.2023", soru: "Düğün tarihini değiştirmek istiyoruz, ne yapmamız gerekiyor?", cevap: "Merhaba, en az 1 ay önceden bildirmeniz durumunda tarih değişikliği yapabiliriz." },
        { id: 2, musteri: "Emre Aydın", tarih: "03.10.2023", soru: "Vejetaryen misafirlerimiz için özel menü seçeneğiniz var mı?", cevap: null },
        { id: 3, musteri: "Pınar Yücel", tarih: "04.10.2023", soru: "Düğün fotoğrafçısı ve kameraman için ekstra ücret ödememiz gerekiyor mu?", cevap: "Tüm paketlerimizde fotoğrafçı ve kameraman hizmeti dahildir, ekstra ücret ödemenize gerek yok." },
        { id: 4, musteri: "Kaan Işık", tarih: "05.10.2023", soru: "Davet salonunun maksimum kapasitesi nedir?", cevap: "Ana salonumuz 400 kişi kapasitesine sahiptir." }
    ];

    const mockYorumlar = [
        { id: 1, musteri: "Deniz & Murat", tarih: "25.08.2023", puan: 5, yorum: "Harika bir düğün oldu, herşey için çok teşekkürler!" },
        { id: 2, musteri: "Sevgi & Onur", tarih: "12.09.2023", puan: 4, yorum: "Yemekler muhteşemdi, organizasyon çok başarılıydı. Daha iyi olabilecek tek şey parkın biraz daha geniş olması olabilirdi." },
        { id: 3, musteri: "Elif & Burak", tarih: "18.09.2023", puan: 3, yorum: "Mekan çok güzeldi fakat hizmet konusunda biraz geç kalındı." },
        { id: 4, musteri: "Gamze & Alper", tarih: "30.09.2023", puan: 5, yorum: "Hayalimizdeki düğünü gerçekleştirdik, herşey kusursuzdu!" }
    ];

    const mockStories = [
        { id: 1, cift: "Merve & Can", tarih: "05.08.2023", hikaye: "2 yıllık bir ilişkinin ardından Can'ın sürpriz evlilik teklifi ile nişanlandık. Tekliften 6 ay sonra ise muhteşem bir düğünle hayatımızı birleştirdik.", fotograflar: ["/images/person-1.webp", "/images/person-2.webp", "/images/person-3.jpg"] },
        { id: 2, cift: "Zeynep & Arda", tarih: "15.09.2023", hikaye: "Üniversitede tanıştık ve 5 yıl boyunca ayrı şehirlerde yaşadıktan sonra nihayet hayatlarımızı birleştirdik.", fotograflar: ["/images/person-4.jpg", "/images/person-3.jpg"] }
    ];

    // İl değiştiğinde ilçeleri güncelle
    useEffect(() => {
        if (firmaProfil.il_id) {
            // Bu ile ait tüm ilçeleri filtrele
            const districts = turkiyeIlIlce.districts.filter(
                d => d.province_id === firmaProfil.il_id
            ).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

            setIlceler(districts);

            // Eğer mevcut ilçe bu ile ait değilse ilçe seçimini sıfırla
            const districtExists = districts.some(d => d.id === firmaProfil.ilce_id);
            if (!districtExists) {
                setFirmaProfil(prev => ({
                    ...prev,
                    ilce_id: null,
                    ilce_adi: ''
                }));
            }
        } else {
            setIlceler([]);
            // İl seçimi yoksa ilçe seçimini sıfırla
            setFirmaProfil(prev => ({
                ...prev,
                ilce_id: null,
                ilce_adi: ''
            }));
        }
    }, [firmaProfil.il_id]);

    // Kullanıcı kontrol işlemi
    useEffect(() => {
        if (!user) {
            router.push('/firmalar-icin/giris');
            return;
        }

        // Kullanıcı tipini kontrol et
        if (user && !isCompanyAccount()) {
            toast.error('Bu sayfaya erişim yetkiniz bulunmamaktadır');
            router.push('/');
            return;
        }

        fetchFirmaProfil();
    }, [user]);

    const fetchFirmaProfil = async () => {
        if (!user) return;

        setFetchLoading(true);
        setFetchError(null);

        try {
            // Önce businesses tablosundan veri çekmeyi deneyelim
            const { data: businessData, error: businessError } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (!businessError && businessData) {
                // İşletme verileri başarıyla alındı
                setFirmaProfil({
                    firma_adi: businessData.name || '',
                    email: businessData.email || user.email || '',
                    telefon: businessData.phone || '',
                    website: businessData.website || '',
                    adres: businessData.address || '',
                    il_id: businessData.city_id || null,
                    il_adi: businessData.city_name || '',
                    ilce_id: businessData.district_id || null,
                    ilce_adi: businessData.district_name || '',
                    aciklama: businessData.description || '',
                    kapasite: businessData.capacity || '',
                    ozellikler: businessData.features || []
                });
                return; // Veri başarıyla alındı, fonksiyonu sonlandır
            }

            // İşletme verisi yoksa veya hata varsa profiles tablosundan almayı dene
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                // Eğer gerçek bir veri hatası varsa (not found hariç)
                if (profileError.code !== 'PGRST116') {
                    console.error('Profil veri hatası:', profileError);
                    throw profileError;
                }
            }

            // Profil verileri başarıyla alındıysa kullan
            if (profileData) {
                setFirmaProfil({
                    firma_adi: profileData.full_name || user.user_metadata?.full_name || '',
                    email: profileData.email || user.email || '',
                    telefon: profileData.phone || user.user_metadata?.phone || '',
                    website: profileData.website || user.user_metadata?.website || '',
                    adres: profileData.address || user.user_metadata?.address || '',
                    il_id: profileData.city_id || user.user_metadata?.city_id || null,
                    il_adi: profileData.city_name || user.user_metadata?.city_name || '',
                    ilce_id: profileData.district_id || user.user_metadata?.district_id || null,
                    ilce_adi: profileData.district_name || user.user_metadata?.district_name || '',
                    aciklama: profileData.description || user.user_metadata?.description || '',
                });
                return;
            }

            // Hiçbir yerden veri alınamadıysa, user metadata'sını kullan
            setFirmaProfil({
                firma_adi: user.user_metadata?.full_name || '',
                email: user.email || '',
                telefon: user.user_metadata?.phone || '',
                website: user.user_metadata?.website || '',
                adres: user.user_metadata?.address || '',
                il_id: user.user_metadata?.city_id || null,
                il_adi: user.user_metadata?.city_name || '',
                ilce_id: user.user_metadata?.district_id || null,
                ilce_adi: user.user_metadata?.district_name || '',
                aciklama: user.user_metadata?.description || '',
            });
        } catch (error) {
            console.error('Firma profil verisi çekme hatası:', error);
            setFetchError('Profil bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setFetchLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'il_id' && value) {
            // İl seçildiğinde, il adını da kaydet
            const selectedProvince = turkiyeIlIlce.provinces.find(p => p.id === parseInt(value));
            if (selectedProvince) {
                setFirmaProfil(prev => ({
                    ...prev,
                    il_id: parseInt(value),
                    il_adi: selectedProvince.name
                }));
            }
        } else if (name === 'ilce_id' && value) {
            // İlçe seçildiğinde, ilçe adını da kaydet
            const selectedDistrict = turkiyeIlIlce.districts.find(d => d.id === parseInt(value));
            if (selectedDistrict) {
                setFirmaProfil(prev => ({
                    ...prev,
                    ilce_id: parseInt(value),
                    ilce_adi: selectedDistrict.name
                }));
            }
        } else {
            setFirmaProfil(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Auth metadatasını güncelle
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: firmaProfil.firma_adi,
                    phone: firmaProfil.telefon,
                    website: firmaProfil.website,
                    adres: firmaProfil.adres,
                    city_id: firmaProfil.il_id,
                    city_name: firmaProfil.il_adi,
                    district_id: firmaProfil.ilce_id,
                    district_name: firmaProfil.ilce_adi,
                    aciklama: firmaProfil.aciklama
                }
            });

            if (authError) throw authError;

            // 2. Profiles tablosunu güncelle
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: firmaProfil.firma_adi,
                    email: user.email,
                    phone: firmaProfil.telefon,
                    website: firmaProfil.website,
                    adres: firmaProfil.adres,
                    city_id: firmaProfil.il_id,
                    city_name: firmaProfil.il_adi,
                    district_id: firmaProfil.ilce_id,
                    district_name: firmaProfil.ilce_adi,
                    aciklama: firmaProfil.aciklama,
                    updated_at: new Date().toISOString()
                });

            if (profileError) throw profileError;

            toast.success('Firma bilgileriniz başarıyla güncellendi!');
            setIsEditing(false);
        } catch (error) {
            console.error('Firma profil güncelleme hatası:', error);
            toast.error('Profil güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/firmalar-icin');
        } catch (error) {
            console.error('Çıkış hatası:', error);
            toast.error('Çıkış yapılırken bir hata oluştu');
        }
    };

    const handleCallMeSuccess = (formData) => {
        console.log('Form bilgileri:', formData);
        toast.success('Geri arama talebiniz alındı!');
    };

    // Kullanıcı giriş yapmamışsa veya firma hesabı değilse
    if (!user || !isCompanyAccount()) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
                        <h1 className="text-xl font-semibold mb-4">Erişim Reddedildi</h1>
                        <p className="mb-6 text-darkgray">
                            Bu sayfaya erişim yetkiniz bulunmamaktadır.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/" className="text-primary font-medium hover:underline">
                                Ana Sayfaya Dön
                            </Link>
                            <Link href="/firmalar-icin/giris" className="text-primary font-medium hover:underline">
                                Firma Girişi Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Firma Paneli</h1>
                    <Button onClick={handleSignOut} variant="outline">Çıkış Yap</Button>
                </div>

                {fetchLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <Tabs defaultValue="profil">
                        <TabsList className="mb-8 flex flex-wrap gap-2">
                            <TabsTrigger value="profil">Firma Bilgileri</TabsTrigger>
                            <TabsTrigger value="teklifler">Teklifler</TabsTrigger>
                            <TabsTrigger value="rezervasyonlar">Rezervasyonlar</TabsTrigger>
                            <TabsTrigger value="randevular">Randevular</TabsTrigger>
                            <TabsTrigger value="sorucevap">Soru-Cevap</TabsTrigger>
                            <TabsTrigger value="yorumlar">Yorumlar</TabsTrigger>
                            <TabsTrigger value="stories">Nişan Hikayeleri</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profil" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Firma Bilgileri</h2>
                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant={isEditing ? "outline" : "default"}
                                >
                                    {isEditing ? "İptal" : <><Edit size={16} className="mr-2" /> Düzenle</>}
                                </Button>
                            </div>

                            {fetchError && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
                                    {fetchError}
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="firma_adi" className="block text-sm font-medium text-text mb-1">
                                            Firma Adı
                                        </label>
                                        <input
                                            type="text"
                                            id="firma_adi"
                                            name="firma_adi"
                                            value={firmaProfil.firma_adi}
                                            onChange={handleChange}
                                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                                            E-posta
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={firmaProfil.email}
                                            className="w-full border border-border rounded-md p-3 text-text bg-gray-50"
                                            disabled={true}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            E-posta adresinizi değiştiremezsiniz
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="telefon" className="block text-sm font-medium text-text mb-1">
                                                Telefon
                                            </label>
                                            <input
                                                type="tel"
                                                id="telefon"
                                                name="telefon"
                                                value={firmaProfil.telefon}
                                                onChange={handleChange}
                                                className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={loading}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="website" className="block text-sm font-medium text-text mb-1">
                                                Web Sitesi
                                            </label>
                                            <input
                                                type="text"
                                                id="website"
                                                name="website"
                                                value={firmaProfil.website}
                                                onChange={handleChange}
                                                className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={loading}
                                                placeholder="https://www.firmaniz.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="adres" className="block text-sm font-medium text-text mb-1">
                                            Adres
                                        </label>
                                        <input
                                            type="text"
                                            id="adres"
                                            name="adres"
                                            value={firmaProfil.adres}
                                            onChange={handleChange}
                                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="il_id" className="block text-sm font-medium text-text mb-1">
                                                İl
                                            </label>
                                            <select
                                                id="il_id"
                                                name="il_id"
                                                value={firmaProfil.il_id || ''}
                                                onChange={handleChange}
                                                className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={loading}
                                            >
                                                <option value="">Seçiniz</option>
                                                {turkiyeIlIlce.provinces.sort((a, b) =>
                                                    a.name.localeCompare(b.name, 'tr')
                                                ).map(province => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="ilce_id" className="block text-sm font-medium text-text mb-1">
                                                İlçe
                                            </label>
                                            <select
                                                id="ilce_id"
                                                name="ilce_id"
                                                value={firmaProfil.ilce_id || ''}
                                                onChange={handleChange}
                                                className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                disabled={loading || !firmaProfil.il_id}
                                            >
                                                <option value="">Seçiniz</option>
                                                {ilceler.map(district => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="aciklama" className="block text-sm font-medium text-text mb-1">
                                            Firma Açıklaması
                                        </label>
                                        <textarea
                                            id="aciklama"
                                            name="aciklama"
                                            value={firmaProfil.aciklama}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full md:w-auto"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                                    Kaydediliyor...
                                                </>
                                            ) : 'Değişiklikleri Kaydet'}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Firma Adı</h3>
                                                <p className="text-lg font-medium">{firmaProfil.firma_adi || 'Belirtilmemiş'}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">E-posta</h3>
                                                <p className="flex items-center">
                                                    <Mail size={16} className="text-gray-500 mr-1" />
                                                    {firmaProfil.email}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Telefon</h3>
                                                <p className="flex items-center">
                                                    <Phone size={16} className="text-gray-500 mr-1" />
                                                    {firmaProfil.telefon || 'Belirtilmemiş'}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Web Sitesi</h3>
                                                <p>
                                                    {firmaProfil.website ? (
                                                        <a href={firmaProfil.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                            {firmaProfil.website}
                                                        </a>
                                                    ) : (
                                                        'Belirtilmemiş'
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Adres</h3>
                                                <p>{firmaProfil.adres || 'Belirtilmemiş'}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Konum</h3>
                                                <p className="flex items-center">
                                                    <MapPin size={16} className="text-gray-500 mr-1" />
                                                    {firmaProfil.il_adi ? (
                                                        <>
                                                            {firmaProfil.il_adi}
                                                            {firmaProfil.ilce_adi && `, ${firmaProfil.ilce_adi}`}
                                                        </>
                                                    ) : (
                                                        'Belirtilmemiş'
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Firma Açıklaması</h3>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            {firmaProfil.aciklama ? (
                                                <p>{firmaProfil.aciklama}</p>
                                            ) : (
                                                <p className="text-gray-400 italic">Henüz firma açıklaması girilmemiş</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="teklifler" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Teklifler</h2>
                                <Button variant="outline" className="flex items-center gap-1">
                                    <Download size={16} />
                                    Dışa Aktar
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Müşteri
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tarih
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Durum
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tutar
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                İşlemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockTeklifler.map((teklif) => (
                                            <tr key={teklif.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{teklif.musteri}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{teklif.tarih}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teklif.durum === "Onaylandı" ? "bg-green-100 text-green-800" :
                                                        teklif.durum === "Beklemede" ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-red-100 text-red-800"
                                                        }`}>
                                                        {teklif.durum}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {teklif.tutar.toLocaleString('tr-TR')} ₺
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button variant="ghost" size="sm">Detay</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {mockTeklifler.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz teklif bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="rezervasyonlar" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Rezervasyonlar</h2>
                                <Button variant="outline" className="flex items-center gap-1">
                                    <Download size={16} />
                                    Dışa Aktar
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Müşteri
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tarih
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Misafir Sayısı
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ödeme Durumu
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tutar
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                İşlemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockRezervasyon.map((rezervasyon) => (
                                            <tr key={rezervasyon.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{rezervasyon.musteri}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{rezervasyon.tarih}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rezervasyon.misafirSayisi}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rezervasyon.odemeDurumu === "Tamamı Ödendi" ? "bg-green-100 text-green-800" :
                                                        rezervasyon.odemeDurumu === "Kapora Alındı" ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-gray-100 text-gray-800"
                                                        }`}>
                                                        {rezervasyon.odemeDurumu}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rezervasyon.tutar.toLocaleString('tr-TR')} ₺
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button variant="ghost" size="sm">Detay</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {mockRezervasyon.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz rezervasyon bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="randevular" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Randevular</h2>
                                <Button variant="outline" className="flex items-center gap-1">
                                    <Plus size={16} />
                                    Yeni Randevu
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Müşteri
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tarih
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Saat
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amaç
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Durum
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                İşlemler
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockRandevular.map((randevu) => (
                                            <tr key={randevu.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{randevu.musteri}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{randevu.tarih}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{randevu.saat}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{randevu.amac}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${randevu.durum === "Tamamlandı" ? "bg-green-100 text-green-800" :
                                                        randevu.durum === "Beklemede" ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-red-100 text-red-800"
                                                        }`}>
                                                        {randevu.durum}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button variant="ghost" size="sm">Düzenle</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {mockRandevular.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz randevu bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="sorucevap" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Soru & Cevaplar</h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex items-center gap-1">
                                        <Download size={16} />
                                        Dışa Aktar
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {mockSorular.map((soru) => (
                                    <div key={soru.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div className="font-medium">{soru.musteri}</div>
                                            <div className="text-sm text-gray-500">{soru.tarih}</div>
                                        </div>
                                        <div className="mt-2 bg-gray-50 p-3 rounded-md">
                                            <p className="font-medium text-gray-800">{soru.soru}</p>
                                        </div>

                                        {soru.cevap ? (
                                            <div className="mt-3 ml-4 border-l-2 border-primary pl-3">
                                                <p className="text-sm font-medium text-gray-500 mb-1">Cevabınız:</p>
                                                <p>{soru.cevap}</p>
                                            </div>
                                        ) : (
                                            <div className="mt-3">
                                                <textarea
                                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
                                                    rows="2"
                                                    placeholder="Bu soruyu yanıtlayın..."
                                                ></textarea>
                                                <div className="mt-2 flex justify-end">
                                                    <Button size="sm">Yanıtla</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {mockSorular.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz soru bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="yorumlar" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Müşteri Yorumları</h2>
                                <div className="flex items-center gap-2">
                                    <div className="bg-yellow-50 text-yellow-700 font-medium px-3 py-1 rounded-md flex items-center">
                                        <span>Ortalama Puan: </span>
                                        <span className="ml-1 text-lg">
                                            {mockYorumlar.length > 0
                                                ? (mockYorumlar.reduce((total, yorum) => total + yorum.puan, 0) / mockYorumlar.length).toFixed(1)
                                                : 0}
                                        </span>
                                        <span className="ml-1 text-yellow-500">★</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {mockYorumlar.map((yorum) => (
                                    <div key={yorum.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div className="font-medium">{yorum.musteri}</div>
                                            <div className="text-sm text-gray-500">{yorum.tarih}</div>
                                        </div>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, index) => (
                                                <span
                                                    key={index}
                                                    className={`text-xl ${index < yorum.puan ? 'text-yellow-500' : 'text-gray-300'}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p className="mt-2">{yorum.yorum}</p>

                                        <div className="mt-3 flex justify-end gap-2">
                                            <Button variant="outline" size="sm">Yanıtla</Button>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {mockYorumlar.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz yorum bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="stories" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Nişan Hikayeleri</h2>
                                <Button variant="outline" className="flex items-center gap-1">
                                    <Plus size={16} />
                                    Yeni Hikaye Ekle
                                </Button>
                            </div>

                            <div className="space-y-8">
                                {mockStories.map((story) => (
                                    <div key={story.id} className="border rounded-lg overflow-hidden">
                                        <div className="p-4">
                                            <div className="flex justify-between">
                                                <h3 className="text-lg font-medium text-primary">{story.cift}</h3>
                                                <div className="text-sm text-gray-500">{story.tarih}</div>
                                            </div>
                                            <p className="mt-2">{story.hikaye}</p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-gray-50">
                                            {story.fotograflar.map((foto, index) => (
                                                <div key={index} className="relative h-48 rounded-md overflow-hidden">
                                                    <Image
                                                        src={foto}
                                                        alt={`${story.cift} fotoğraf ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-4 flex justify-end gap-2">
                                            <Button variant="outline" size="sm">Düzenle</Button>
                                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:border-red-500">
                                                Kaldır
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {mockStories.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Henüz nişan hikayesi bulunmamaktadır.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            <CallMeForm
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleCallMeSuccess}
            />

            <Toaster position="top-right" />
        </Layout>
    );
} 