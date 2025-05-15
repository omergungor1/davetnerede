"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/auth-context';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Edit, UserCheck, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import turkiyeIlIlce from '@/data/turkiye-il-ilce';

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
    const [musteriler, setMusteriler] = useState([]);
    const [musterilerLoading, setMusterilerLoading] = useState(false);

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
        fetchMusteriler();
    }, [user]);

    const fetchFirmaProfil = async () => {
        if (!user) return;

        setFetchLoading(true);
        setFetchError(null);

        try {
            // Profiles tablosundan veri çek
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                // Hem auth metadata hem de profiles tablosundan veri birleştir
                setFirmaProfil({
                    firma_adi: data.full_name || user.user_metadata?.full_name || '',
                    email: data.email || user.email || '',
                    telefon: data.phone || user.user_metadata?.phone || '',
                    website: data.website || user.user_metadata?.website || '',
                    adres: data.adres || user.user_metadata?.adres || '',
                    il_id: data.city_id || user.user_metadata?.city_id || null,
                    il_adi: data.city_name || user.user_metadata?.city_name || '',
                    ilce_id: data.district_id || user.user_metadata?.district_id || null,
                    ilce_adi: data.district_name || user.user_metadata?.district_name || '',
                    aciklama: data.aciklama || user.user_metadata?.aciklama || '',
                });
            } else {
                setFirmaProfil({
                    firma_adi: user.user_metadata?.full_name || '',
                    email: user.email || '',
                    telefon: user.user_metadata?.phone || '',
                    website: user.user_metadata?.website || '',
                    adres: user.user_metadata?.adres || '',
                    il_id: user.user_metadata?.city_id || null,
                    il_adi: user.user_metadata?.city_name || '',
                    ilce_id: user.user_metadata?.district_id || null,
                    ilce_adi: user.user_metadata?.district_name || '',
                    aciklama: user.user_metadata?.aciklama || '',
                });
            }
        } catch (error) {
            console.error('Firma profil verisi çekme hatası:', error);
            setFetchError('Profil bilgileri yüklenirken bir hata oluştu.');
        } finally {
            setFetchLoading(false);
        }
    };

    const fetchMusteriler = async () => {
        if (!user) return;

        setMusterilerLoading(true);

        try {
            // Shared_profiles view'dan müşteri verilerini çek
            const { data, error } = await supabase
                .from('shared_profiles')
                .select('*')
                .eq('user_type', 'user');

            if (error) {
                throw error;
            }

            setMusteriler(data || []);
        } catch (error) {
            console.error('Müşteri verisi çekme hatası:', error);
            toast.error('Müşteri bilgileri yüklenirken bir hata oluştu.');
        } finally {
            setMusterilerLoading(false);
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
                    <h1 className="text-2xl font-bold">Firma Kontrol Paneli</h1>
                    <Button onClick={handleSignOut} variant="outline">Çıkış Yap</Button>
                </div>

                {fetchLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <Tabs defaultValue="profil">
                        <TabsList className="mb-8">
                            <TabsTrigger value="profil">Firma Profili</TabsTrigger>
                            <TabsTrigger value="musteriler">Müşteri Bilgileri</TabsTrigger>
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

                        <TabsContent value="musteriler" className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Müşteri Bilgileri</h2>
                                <Button
                                    onClick={fetchMusteriler}
                                    variant="outline"
                                    disabled={musterilerLoading}
                                >
                                    {musterilerLoading ? (
                                        <Loader2 size={16} className="mr-2 animate-spin" />
                                    ) : (
                                        <><UserCheck size={16} className="mr-2" /> Yenile</>
                                    )}
                                </Button>
                            </div>

                            {musterilerLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : musteriler.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-md">
                                    <p className="text-gray-500">Henüz sistemde müşteri bulunmamaktadır.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ad Soyad
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Telefon
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    İl
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    İlçe
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {musteriler.map((musteri) => (
                                                <tr key={musteri.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{musteri.full_name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{musteri.phone || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{musteri.city_name || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{musteri.district_name || '-'}</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </Layout>
    );
} 