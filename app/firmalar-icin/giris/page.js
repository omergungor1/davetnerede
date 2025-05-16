"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth-context';
import toast, { Toaster } from 'react-hot-toast';

export default function FirmaGiris() {
    const router = useRouter();
    const { user, signIn, loading: authLoading, isCompanyAccount } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    // Kullanıcı kontrol işlemi
    useEffect(() => {
        if (authLoading) {
            // Auth durumu yükleniyorsa, bekleyelim
            return;
        }

        if (user) {
            // Kullanıcı zaten giriş yapmışsa, tipine göre yönlendir
            if (isCompanyAccount()) {
                router.push('/firmalar-icin/firma-profil');
            } else {
                router.push('/hesabim/profil');
            }
        }
    }, [user, authLoading, router, isCompanyAccount]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: val
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Auth context'ten signIn fonksiyonunu kullanarak giriş yap
            const { data, error } = await signIn(
                formData.email,
                formData.password
            );

            if (error) {
                throw error;
            }

            // Giriş başarılı olduğunda yönlendirme yap
            toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
            router.push('/firmalar-icin/firma-profil'); // Başarılı girişte kullanıcıyı firma profil sayfasına yönlendir
        } catch (err) {
            console.error('Giriş hatası:', err);
            setError(err.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Burada gerçek şifre sıfırlama API çağrısı yapılacak
            console.log('Şifre sıfırlama isteği gönderiliyor', resetEmail);

            // Simüle edilmiş bir işlem (gerçek projede API çağrısı yapılacak)
            await new Promise(resolve => setTimeout(resolve, 1500));

            setResetSent(true);
        } catch (err) {
            setError('Şifre sıfırlama isteği gönderilemedi. Lütfen daha sonra tekrar deneyiniz.');
            console.error('Şifre sıfırlama hatası:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);
        setResetSent(false);
        setError('');
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {authLoading ? (
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                        <div className="flex flex-col items-center justify-center py-12">
                            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-4 text-gray-500">Yükleniyor...</p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <Link href="/" className="flex justify-center">
                            <Image
                                src="/images/logo.png"
                                alt="Davet Evi Bul"
                                width={60}
                                height={60}
                                className="mx-auto"
                            />
                        </Link>
                        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                            Firma Girişi
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Davet Evi Bul platformunda firma hesabınıza giriş yapın
                        </p>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                            {showForgotPassword ? (
                                // Şifremi Unuttum Formu
                                <>
                                    {resetSent ? (
                                        <div className="rounded-md bg-green-50 p-4 mb-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-green-800">
                                                        Şifre sıfırlama bağlantısı gönderildi. Lütfen e-posta kutunuzu kontrol edin.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form className="space-y-6" onSubmit={handleResetPassword}>
                                            <div>
                                                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                                                    E-posta Adresi
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        id="reset-email"
                                                        name="reset-email"
                                                        type="email"
                                                        autoComplete="email"
                                                        required
                                                        value={resetEmail}
                                                        onChange={(e) => setResetEmail(e.target.value)}
                                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                        placeholder="ornek@firmaniz.com"
                                                    />
                                                </div>
                                            </div>

                                            {error && (
                                                <div className="rounded-md bg-red-50 p-4">
                                                    <div className="flex">
                                                        <div className="flex-shrink-0">
                                                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-red-800">
                                                                {error}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={toggleForgotPassword}
                                                    className="text-sm font-medium text-primary hover:text-primary/80"
                                                >
                                                    Geri Dön
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className={`w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {isLoading ? 'Gönderiliyor...' : 'Şifremi Sıfırla'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            ) : (
                                // Normal Giriş Formu
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            E-posta Adresi
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                placeholder="ornek@firmaniz.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Şifre
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="rounded-md bg-red-50 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-red-800">
                                                        {error}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="rememberMe"
                                                name="rememberMe"
                                                type="checkbox"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                            />
                                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                                                Beni Hatırla
                                            </label>
                                        </div>

                                        <div className="text-sm">
                                            <button
                                                type="button"
                                                onClick={toggleForgotPassword}
                                                className="font-medium text-primary hover:text-primary/80"
                                            >
                                                Şifremi unuttum
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => router.push('/')}
                                            className={`w-full flex justify-center py-2 px-4 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                                        >
                                            Ana Sayfa
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            Henüz hesabınız yok mu?
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <Link href="/firmalar-icin/kayit" className="font-medium text-primary hover:text-primary/80">
                                        Hemen ücretsiz firma hesabı oluşturun
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <Link href="/firmalar-icin" className="font-medium text-primary hover:text-primary/80">
                            ← Firma Sayfasına Dön
                        </Link>
                    </div>
                </>
            )}
            <Toaster position="top-right" />
        </main>
    );
} 