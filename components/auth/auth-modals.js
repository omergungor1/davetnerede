"use client";

import { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import Link from 'next/link';
import turkiyeIlIlce from '../../data/turkiye-il-ilce';
import { formatPhoneNumber } from '../ui/utils';

export function AuthModals({ isLoginOpen, isRegisterOpen, onClose }) {
    const [loginData, setLoginData] = useState({
        email: '',
        sifre: '',
        remember: false
    });

    const [registerData, setRegisterData] = useState({
        adSoyad: '',
        email: '',
        telefon: '',
        il: '',
        sifre: '',
        terms: false
    });

    const [registerStep, setRegisterStep] = useState(1);
    const [firstStepValid, setFirstStepValid] = useState(false);
    const [secondStepValid, setSecondStepValid] = useState(false);

    // İlk adımın geçerli olup olmadığını kontrol eden fonksiyon
    useEffect(() => {
        const { adSoyad, email, telefon } = registerData;
        setFirstStepValid(adSoyad.trim() !== '' && email.trim() !== '' && telefon.trim() !== '');
    }, [registerData.adSoyad, registerData.email, registerData.telefon]);

    // İkinci adımın geçerli olup olmadığını kontrol eden fonksiyon
    useEffect(() => {
        const { il, sifre, terms } = registerData;
        setSecondStepValid(il.trim() !== '' && sifre.trim() !== '' && terms === true);
    }, [registerData.il, registerData.sifre, registerData.terms]);

    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'telefon') {
            setRegisterData(prev => ({
                ...prev,
                [name]: formatPhoneNumber(value)
            }));
        } else {
            setRegisterData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log("Login data:", loginData);
        // API'ye gönderme işlemi burada yapılacak
        onClose();
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        console.log("Register data:", registerData);
        // API'ye gönderme işlemi burada yapılacak
        onClose();
        setRegisterStep(1); // Formu sıfırla
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
    };

    // Giriş Modalı
    const renderLoginModal = () => (
        <Modal isOpen={isLoginOpen} onClose={onClose} title="Giriş Yap">
            <div className="py-4">
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
                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-darkgray">
                            <input type="checkbox" className="form-checkbox h-4 w-4 text-primary border-darkgray rounded focus:ring-primary mr-2" />
                            Beni hatırla
                        </label>
                        <Link href="#" className="text-primary hover:underline">
                            Şifremi unuttum
                        </Link>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full">
                            Giriş Yap
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
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    {registerData.email.trim() === '' && <p className="text-xs text-gray-500 mt-1">Geçerli bir e-posta adresi gereklidir</p>}
                                </div>

                                <div>
                                    <label htmlFor="reg-telefon" className="block text-sm font-medium text-text mb-1">Telefon Numarası</label>
                                    <input
                                        type="tel"
                                        id="reg-telefon"
                                        name="telefon"
                                        value={registerData.telefon}
                                        onChange={handleRegisterChange}
                                        required
                                        placeholder="05XX XXX XX XX"
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    {registerData.telefon.trim() === '' && <p className="text-xs text-gray-500 mt-1">Geçerli bir telefon numarası gereklidir</p>}
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="button"
                                        onClick={goToNextStep}
                                        disabled={!firstStepValid}
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
                                    <label htmlFor="il" className="block text-sm font-medium text-text mb-1">Cemiyet Yapacağınız İl</label>
                                    <select
                                        id="il"
                                        name="il"
                                        value={registerData.il}
                                        onChange={handleRegisterChange}
                                        required
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="">Seçiniz</option>
                                        {turkiyeIlIlce.provinces.map((province) => (
                                            <option key={province.id} value={province.name}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                    {registerData.il === '' && <p className="text-xs text-gray-500 mt-1">Lütfen bir il seçin</p>}
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
                                        className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                                    >
                                        Geri Dön
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!secondStepValid}
                                        className="w-1/2"
                                    >
                                        Üye Ol
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
                        >
                            Giriş Yapın
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );

    return (
        <>
            {renderLoginModal()}
            {renderRegisterModal()}
        </>
    );
} 