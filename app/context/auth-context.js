"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Supabase auth durumu değişikliğini dinleyen event listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, currentSession) => {
                setSession(currentSession);
                setUser(currentSession?.user || null);
                setLoading(false);
            }
        );

        // Mevcut oturum bilgisini al
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            setSession(currentSession);
            setUser(currentSession?.user || null);
            setLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Kullanıcı profilini Supabase profiles tablosuna ekle
    const createUserProfile = async (userId, profileData) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: userId,
                        full_name: profileData.full_name || '',
                        email: profileData.email,
                        phone: profileData.phone || '',
                        city_id: profileData.city_id || null,
                        city_name: profileData.city_name || '',
                        district_id: profileData.district_id || null,
                        district_name: profileData.district_name || '',
                        user_type: profileData.user_type || 'user',
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Profil oluşturma hatası:', error);
            return { error };
        }
    };

    const signUp = async (email, password, metadata = {}, userType = 'user') => {
        try {
            // E-posta adresini daha detaylı temizle
            const cleanEmail = email.trim().toLowerCase().replace(/\s+/g, "").replace(/[\r\n\t]/g, "");

            // Şifreyi temizle
            const cleanPassword = password.trim().replace(/\s+/g, "").replace(/[\r\n\t]/g, "");

            // E-posta formatı kontrolü
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cleanEmail)) {
                return {
                    data: null,
                    error: { message: "Geçersiz e-posta formatı. Lütfen geçerli bir e-posta adresi girin." }
                };
            }

            // API'ye istek at
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: cleanEmail,
                    password: cleanPassword,
                    metadata: {
                        ...metadata,
                        user_type: userType
                    },
                    userType
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                return {
                    data: null,
                    error: { message: result.error || 'Kayıt işlemi sırasında bir hata oluştu' }
                };
            }

            // Başarılı kayıt sonrası otomatik giriş yap
            if (result.data && result.data.user) {
                await signIn(cleanEmail, cleanPassword);
            }

            return { data: result.data, error: null };
        } catch (error) {
            console.error('Kayıt hatası:', error);
            return { data: null, error };
        }
    };

    const signIn = async (email, password) => {
        try {
            // E-posta adresini daha detaylı temizle
            const cleanEmail = email.trim().toLowerCase().replace(/\s+/g, "").replace(/[\r\n\t]/g, "");

            // Şifreyi temizle
            const cleanPassword = password.trim().replace(/\s+/g, "").replace(/[\r\n\t]/g, "");

            // E-posta formatı kontrolü
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(cleanEmail)) {
                return {
                    data: null,
                    error: { message: "Geçersiz e-posta formatı. Lütfen geçerli bir e-posta adresi girin." }
                };
            }

            // Normal giriş dene
            const { data, error } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password: cleanPassword,
            });

            // Eğer e-posta doğrulanmamış hatası alınırsa doğrulama API'sini çağır
            if (error && error.message && error.message.includes("Email not confirmed")) {
                try {
                    // E-posta doğrulama API'sini çağır
                    const verifyResponse = await fetch('/api/auth/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: cleanEmail }),
                    });

                    const verifyResult = await verifyResponse.json();

                    if (!verifyResponse.ok) {
                        return {
                            data: null,
                            error: { message: verifyResult.error || 'E-posta doğrulama işlemi sırasında bir hata oluştu' }
                        };
                    }

                    // Doğrulama başarılı olduğunda tekrar giriş yap
                    return await supabase.auth.signInWithPassword({
                        email: cleanEmail,
                        password: cleanPassword,
                    });
                } catch (verifyError) {
                    console.error('E-posta doğrulama hatası:', verifyError);
                    return { data: null, error };
                }
            }

            return { data, error };
        } catch (error) {
            console.error('Giriş hatası:', error);
            return { data: null, error };
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    // Kullanıcı tipini kontrol eden yardımcı fonksiyon
    const isCompanyAccount = () => {
        if (!user) return false;
        return user.user_metadata?.user_type === 'company';
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        createUserProfile,
        isCompanyAccount
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
} 