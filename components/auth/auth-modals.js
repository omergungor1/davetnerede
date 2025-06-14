"use client";

import { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import Link from 'next/link';
import { formatPhoneNumber } from '../ui/utils';
import { useAuth } from '@/app/context/auth-context';
import toast from 'react-hot-toast';

export function AuthModals({ isLoginOpen, isRegisterOpen, onClose }) {
    const { signIn, signUp, user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

    const [loginData, setLoginData] = useState({
        email: '',
        sifre: '',
        remember: false
    });

    const [registerData, setRegisterData] = useState({
        adSoyad: '',
        email: '',
        telefon: '',
        sifre: '',
        terms: false
    });

    const [registerStep, setRegisterStep] = useState(1);
    const [firstStepValid, setFirstStepValid] = useState(false);
    const [secondStepValid, setSecondStepValid] = useState(false);

    // İlk adımın geçerli olup olmadığını kontrol eden fonksiyon
    useEffect(() => {
        const { adSoyad, email, telefon } = registerData;
        setFirstStepValid(adSoyad.trim() !== '' && email.trim() !== '');
    }, [registerData.adSoyad, registerData.email]);

    // İkinci adımın geçerli olup olmadığını kontrol eden fonksiyon
    useEffect(() => {
        const { telefon, sifre, terms } = registerData;
        setSecondStepValid(telefon.trim() !== '' && sifre.trim() !== '' && terms === true);
    }, [registerData.telefon, registerData.sifre, registerData.terms]);



    // Kullanıcı zaten giriş yapmışsa modalları kapatma kontrolü
    useEffect(() => {
        if (user && (isLoginOpen || isRegisterOpen)) {
            onClose();
        }
    }, [user, isLoginOpen, isRegisterOpen, onClose]);

    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'email') {
            // E-posta alanı için boşlukları anlık olarak temizle
            setLoginData(prev => ({
                ...prev,
                [name]: value.replace(/\s+/g, "")
            }));
        } else if (name === 'sifre') {
            // Şifre alanı için önlem olarak anlık temizleme
            setLoginData(prev => ({
                ...prev,
                [name]: value.replace(/\s+/g, "")
            }));
        } else {
            setLoginData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'telefon') {
            setRegisterData(prev => ({
                ...prev,
                [name]: formatPhoneNumber(value)
            }));
        } else if (name === 'email') {
            // E-posta alanı için boşlukları anlık olarak temizle
            setRegisterData(prev => ({
                ...prev,
                [name]: value.replace(/\s+/g, "")
            }));
        } else if (name === 'sifre') {
            // Şifre alanı için önlem olarak anlık temizleme
            setRegisterData(prev => ({
                ...prev,
                [name]: value.replace(/\s+/g, "")
            }));
        } else {
            setRegisterData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthError('');

        try {
            const { error } = await signIn(loginData.email.trim(), loginData.sifre.trim());

            if (error) {
                setAuthError(error.message || 'Giriş yapılırken bir hata oluştu');
                toast.error(error.message || 'Giriş yapılırken bir hata oluştu');
            } else {
                toast.success('Başarıyla giriş yapıldı!');
                onClose();
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            setAuthError('Giriş yapılırken bir hata oluştu');
            toast.error('Giriş yapılırken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAuthError('');

        try {
            const { data, error } = await signUp(
                registerData.email.trim(),
                registerData.sifre.trim(),
                {
                    full_name: registerData.adSoyad.trim(),
                    phone: registerData.telefon,
                }
            );

            if (error) {
                setAuthError(error.message || 'Kayıt olurken bir hata oluştu');
                toast.error(error.message || 'Kayıt olurken bir hata oluştu');
            } else {
                setIsSubmitSuccess(true);
                toast.success('Kayıt işlemi başarılı! Aramıza hoşgeldiniz.');

                // Başarılı kayıt sonrası 3 saniye sonra kapatma
                setTimeout(() => {
                    onClose();
                    setRegisterStep(1);
                    setIsSubmitSuccess(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Kayıt hatası:', error);
            setAuthError('Kayıt olurken bir hata oluştu');
            toast.error('Kayıt olurken bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const goToNextStep = () => {
        if (firstStepValid) {
            setRegisterStep(2);
        }
    };

    const goToPreviousStep = () => {
        setRegisterStep(1);
    };

    const handleModalClose = () => {
        onClose();
        setRegisterStep(1); // Modal kapandığında kayıt adımını sıfırla
        setAuthError(''); // Hataları sıfırla
        setIsSubmitSuccess(false); // Başarı durumunu sıfırla
    };

    // Giriş Modalı
    const renderLoginModal = () => (
        <Modal isOpen={isLoginOpen} onClose={handleModalClose} title="Giriş Yap">
            <div className="py-4">
                {authError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                        {authError}
                    </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text mb-1">E-posta</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                            placeholder="E-posta adresinizi girin"
                            className="w-full border border-border rounded-md p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="sifre" className="block text-sm font-medium text-text mb-1">Şifre</label>
                        <input
                            type="password"
                            id="sifre"
                            name="sifre"
                            value={loginData.sifre}
                            onChange={handleLoginChange}
                            required
                            className="w-full border border-border rounded-md p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-darkgray">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={loginData.remember}
                                onChange={handleLoginChange}
                                className="form-checkbox h-4 w-4 text-primary border-darkgray rounded focus:ring-primary mr-2"
                                disabled={isLoading}
                            />
                            Beni hatırla
                        </label>
                        <Link href="#" className="text-primary hover:underline">
                            Şifremi unuttum
                        </Link>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </Button>
                    </div>

                    <div className="text-center text-sm text-darkgray">
                        Hesabınız yok mu?{' '}
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                setTimeout(() => document.getElementById('register-button').click(), 300);
                            }}
                            className="text-primary hover:underline"
                            disabled={isLoading}
                        >
                            Üye Olun
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );

    // Kayıt Modalı
    const renderRegisterModal = () => (
        <Modal isOpen={isRegisterOpen} onClose={handleModalClose} title="Üye Ol">
            <div className="py-4">
                {authError && !isSubmitSuccess && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">
                        {authError}
                    </div>
                )}

                {isSubmitSuccess ? (
                    <div className="py-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Kayıt İşlemi Başarılı!</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Davet Evi Bul ailesine hoşgeldiniz. Sizi aramızda görmekten çok güzel.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleRegisterSubmit}>
                        <div className="relative overflow-hidden px-2">
                            {/* İlk Adım */}
                            <div
                                className={`transition-all duration-300 ease-in-out ${registerStep === 1
                                    ? 'translate-x-0 opacity-100'
                                    : '-translate-x-full absolute opacity-0'
                                    }`}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="adSoyad" className="block text-sm font-medium text-text mb-1">Ad Soyad</label>
                                        <input
                                            type="text"
                                            id="adSoyad"
                                            name="adSoyad"
                                            value={registerData.adSoyad}
                                            onChange={handleRegisterChange}
                                            required
                                            className="w-full border border-border rounded-md p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={isLoading}
                                        />
                                        {registerData.adSoyad.trim() === '' && <p className="text-xs text-gray-500 mt-1">Lütfen adınızı ve soyadınızı girin</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="reg-email" className="block text-sm font-medium text-text mb-1">E-posta Adresi</label>
                                        <input
                                            type="email"
                                            id="reg-email"
                                            name="email"
                                            value={registerData.email}
                                            onChange={handleRegisterChange}
                                            required
                                            className="w-full border border-border rounded-md p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={isLoading}
                                        />
                                        {registerData.email === '' && <p className="text-xs text-gray-500 mt-1">Geçerli bir e-posta adresi gereklidir</p>}
                                    </div>
                                    <div className="pt-4">
                                        <Button
                                            type="button"
                                            onClick={goToNextStep}
                                            disabled={!firstStepValid || isLoading}
                                        >
                                            Devam Et
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* İkinci Adım */}
                            <div
                                className={`transition-all duration-300 ease-in-out ${registerStep === 2
                                    ? 'translate-x-0 opacity-100'
                                    : 'translate-x-full absolute opacity-0'
                                    }`}
                            >
                                <div className="space-y-4">

                                    <div>
                                        <label htmlFor="reg-telefon" className="block text-sm font-medium text-text mb-1">Telefon Numarası</label>
                                        <input
                                            type="tel"
                                            id="reg-telefon"
                                            name="telefon"
                                            maxLength={14}
                                            value={registerData.telefon}
                                            onChange={handleRegisterChange}
                                            required
                                            placeholder="05XX XXX XX XX"
                                            className="w-full border border-border rounded-md p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={isLoading}
                                        />
                                        {registerData.telefon.trim() === '' && <p className="text-xs text-gray-500 mt-1">Geçerli bir telefon numarası gereklidir</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="reg-sifre" className="block text-sm font-medium text-text mb-1">Şifre</label>
                                        <input
                                            type="password"
                                            id="reg-sifre"
                                            name="sifre"
                                            value={registerData.sifre}
                                            onChange={handleRegisterChange}
                                            required
                                            className="w-full border border-border rounded-md p-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            disabled={isLoading}
                                        />
                                        {registerData.sifre.trim() === '' && <p className="text-xs text-gray-500 mt-1">Şifre en az 6 karakter olmalıdır</p>}
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            name="terms"
                                            checked={registerData.terms}
                                            onChange={handleRegisterChange}
                                            className="form-checkbox h-4 w-4 text-primary border-darkgray rounded focus:ring-primary mr-2"
                                            required
                                            disabled={isLoading}
                                        />
                                        <label htmlFor="terms" className="text-darkgray">
                                            <span>
                                                <Link href="/kullanim-kosullari" className="text-primary hover:underline">Kullanım Koşullarını</Link> ve{' '}
                                                <Link href="/gizlilik-politikasi" className="text-primary hover:underline">Gizlilik Politikasını</Link> okudum ve kabul ediyorum.
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={goToPreviousStep}
                                            className="w-1/2"
                                            disabled={isLoading}
                                        >
                                            Geri Dön
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={!secondStepValid || isLoading}
                                            className="w-1/2"
                                        >
                                            {isLoading ? 'Üye Olunuyor...' : 'Üye Ol'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-sm text-darkgray pt-4 mt-4 border-t border-gray-100">
                            Zaten üye misiniz?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    setTimeout(() => document.getElementById('login-button').click(), 300);
                                }}
                                className="text-primary hover:underline"
                                disabled={isLoading}
                            >
                                Giriş Yapın
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );

    // Kullanıcı zaten giriş yapmışsa modalları gösterme
    if (user) {
        return null;
    }

    return (
        <>
            {renderLoginModal()}
            {renderRegisterModal()}
        </>
    );
} 