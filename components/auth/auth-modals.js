"use client";

import { useState } from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import Link from 'next/link';

export function AuthModals({ isLoginOpen, isRegisterOpen, onClose }) {
    const [loginData, setLoginData] = useState({
        emailOrTelefon: '',
        sifre: '',
    });

    const [registerData, setRegisterData] = useState({
        adSoyad: '',
        email: '',
        telefon: '',
        sifre: '',
        il: '',
    });

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // Giriş işlemleri burada yapılacak
        alert('Giriş başarılı!');
        onClose();
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        // Kayıt işlemleri burada yapılacak
        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
        onClose();
    };

    // Giriş Modalı
    const renderLoginModal = () => (
        <Modal isOpen={isLoginOpen} onClose={onClose} title="Giriş Yap">
            <div className="py-4">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="emailOrTelefon" className="block text-sm font-medium text-text mb-1">E-posta veya Telefon</label>
                        <input
                            type="text"
                            id="emailOrTelefon"
                            name="emailOrTelefon"
                            value={loginData.emailOrTelefon}
                            onChange={handleLoginChange}
                            required
                            placeholder="E-posta veya telefonunuzu girin"
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
        <Modal isOpen={isRegisterOpen} onClose={onClose} title="Üye Ol">
            <div className="py-4">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                            className="w-full border border-border rounded-md p-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

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
                            <option value="İstanbul">İstanbul</option>
                            <option value="Ankara">Ankara</option>
                            <option value="İzmir">İzmir</option>
                            <option value="Bursa">Bursa</option>
                            <option value="Antalya">Antalya</option>
                            {/* Diğer iller... */}
                        </select>
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
                    </div>

                    <div className="flex items-center text-sm">
                        <input type="checkbox" id="terms" className="form-checkbox h-4 w-4 text-primary border-darkgray rounded focus:ring-primary mr-2" required />
                        <label htmlFor="terms" className="text-darkgray">
                            <span>
                                <Link href="/kullanim-kosullari" className="text-primary hover:underline">Kullanım Koşullarını</Link> ve{' '}
                                <Link href="/gizlilik-politikasi" className="text-primary hover:underline">Gizlilik Politikasını</Link> okudum ve kabul ediyorum.
                            </span>
                        </label>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full">
                            Üye Ol
                        </Button>
                    </div>

                    <div className="text-center text-sm text-darkgray">
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