"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/auth-context';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import turkiyeIlIlce from '@/data/turkiye-il-ilce';
import { AccountLayout } from '@/components/account/account-layout';

export default function ProfilPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: '',
        email: '',
        phone: '',
        city_id: null,
        city_name: '',
        district_id: null,
        district_name: ''
    });
    const [ilceler, setIlceler] = useState([]);
    const [fetchError, setFetchError] = useState(null);

    // İl değiştiğinde ilçeleri güncelle
    useEffect(() => {
        if (profileData.city_id) {
            // Bu ile ait tüm ilçeleri filtrele
            const districts = turkiyeIlIlce.districts.filter(
                d => d.province_id === profileData.city_id
            ).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

            setIlceler(districts);

            // Eğer mevcut ilçe bu ile ait değilse ilçe seçimini sıfırla
            const districtExists = districts.some(d => d.id === profileData.district_id);
            if (!districtExists) {
                setProfileData(prev => ({
                    ...prev,
                    district_id: null,
                    district_name: ''
                }));
            }
        } else {
            setIlceler([]);
            // İl seçimi yoksa ilçe seçimini sıfırla
            setProfileData(prev => ({
                ...prev,
                district_id: null,
                district_name: ''
            }));
        }
    }, [profileData.city_id]);

    const fetchProfileData = async (userId) => {
        try {
            // API endpoint'i kullanarak profil bilgilerini çek
            const response = await fetch(`/api/profile?userId=${userId}`);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Profil bilgileri alınamadı');
            }

            if (result.data) {
                // API'den profil bilgilerini al
                setProfileData({
                    full_name: result.data.full_name || user.user_metadata?.full_name || '',
                    email: result.data.email || user.email || '',
                    phone: result.data.phone || user.user_metadata?.phone || '',
                    city_id: result.data.city_id || user.user_metadata?.city_id || null,
                    city_name: result.data.city_name || user.user_metadata?.city_name || '',
                    district_id: result.data.district_id || user.user_metadata?.district_id || null,
                    district_name: result.data.district_name || user.user_metadata?.district_name || ''
                });
            } else {
                // Profil bulunamadıysa sadece auth metadatası kullan
                setProfileData({
                    full_name: user.user_metadata?.full_name || '',
                    email: user.email || '',
                    phone: user.user_metadata?.phone || '',
                    city_id: user.user_metadata?.city_id || null,
                    city_name: user.user_metadata?.city_name || '',
                    district_id: user.user_metadata?.district_id || null,
                    district_name: user.user_metadata?.district_name || ''
                });
            }
        } catch (error) {
            console.error('Profil veri çekme hatası:', error);
            setFetchError('Profil bilgileri yüklenirken bir hata oluştu.');

            // Hata durumunda sadece auth metadatasından profili göster
            setProfileData({
                full_name: user.user_metadata?.full_name || '',
                email: user.email || '',
                phone: user.user_metadata?.phone || '',
                city_id: user.user_metadata?.city_id || null,
                city_name: user.user_metadata?.city_name || '',
                district_id: user.user_metadata?.district_id || null,
                district_name: user.user_metadata?.district_name || ''
            });
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfileData(user.id);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'city_id' && value) {
            // İl seçildiğinde, il adını da kaydet
            const selectedProvince = turkiyeIlIlce.provinces.find(p => p.id === parseInt(value));
            if (selectedProvince) {
                setProfileData(prev => ({
                    ...prev,
                    city_id: parseInt(value),
                    city_name: selectedProvince.name
                }));
            }
        } else if (name === 'district_id' && value) {
            // İlçe seçildiğinde, ilçe adını da kaydet
            const selectedDistrict = turkiyeIlIlce.districts.find(d => d.id === parseInt(value));
            if (selectedDistrict) {
                setProfileData(prev => ({
                    ...prev,
                    district_id: parseInt(value),
                    district_name: selectedDistrict.name
                }));
            }
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // API endpoint'i kullanarak profil güncelle
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    profileData: {
                        full_name: profileData.full_name,
                        email: user.email, // E-posta değiştirilemiyor
                        phone: profileData.phone,
                        city_id: profileData.city_id,
                        city_name: profileData.city_name,
                        district_id: profileData.district_id,
                        district_name: profileData.district_name
                    }
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Profil güncellenirken bir hata oluştu');
            }

            toast.success('Profil bilgileriniz başarıyla güncellendi!');
        } catch (error) {
            console.error('Profil güncelleme hatası:', error);
            toast.error('Profil güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AccountLayout title="Profil Bilgilerim">
            {fetchError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
                    {fetchError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-text mb-1">
                        Ad Soyad
                    </label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={profileData.full_name}
                        onChange={handleChange}
                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                        E-posta Adresi
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        className="w-full border border-border rounded-md p-3 text-text bg-gray-50 focus:outline-none"
                        disabled={true}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        E-posta adresinizi değiştiremezsiniz
                    </p>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">
                        Telefon Numarası
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="05XX XXX XX XX"
                        disabled={loading}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="city_id" className="block text-sm font-medium text-text mb-1">
                            İl
                        </label>
                        <select
                            id="city_id"
                            name="city_id"
                            value={profileData.city_id || ''}
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
                        <label htmlFor="district_id" className="block text-sm font-medium text-text mb-1">
                            İlçe
                        </label>
                        <select
                            id="district_id"
                            name="district_id"
                            value={profileData.district_id || ''}
                            onChange={handleChange}
                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                            disabled={loading || !profileData.city_id}
                        >
                            <option value="">Seçiniz</option>
                            {ilceler.map(district => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                        {!profileData.city_id && (
                            <p className="text-xs text-gray-500 mt-1">
                                Önce il seçiniz
                            </p>
                        )}
                    </div>
                </div>

                <div className="pt-4">
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
        </AccountLayout>
    );
}
