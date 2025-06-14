"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/context/auth-context';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import turkiyeIlIlce from '@/data/turkiye-il-ilce';
import { AccountLayout } from '@/components/account/account-layout';
import { supabase } from '@/lib/supabase';

export default function ProfilPage() {
    const { user, session } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [ilceler, setIlceler] = useState([]);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        if (!session?.access_token) return;

        fetchProfileData();
    }, [session]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Profil bilgileri alınamadı');
            }

            setProfileData(result.data);
        } catch (error) {
            console.error('Profil bilgileri getirme hatası:', error);
            // Hata durumunda UI'da gösterilecek
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (updatedData) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Profil güncellenemedi');
            }

            setProfileData(result.data);
            return { success: true };
        } catch (error) {
            console.error('Profil güncelleme hatası:', error);
            return { success: false, error: error.message };
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await handleProfileUpdate(profileData);

            if (result.success) {
                toast.success('Profil bilgileriniz başarıyla güncellendi!');
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Profil güncelleme hatası:', error);
            toast.error('Profil güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

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
                        value={profileData?.full_name || ''}
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
                        value={profileData?.email || ''}
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
                        value={profileData?.phone || ''}
                        onChange={handleChange}
                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="05XX XXX XX XX"
                        disabled={loading}
                    />
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
