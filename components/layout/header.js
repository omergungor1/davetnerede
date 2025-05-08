"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Search, Heart, Menu, User, X } from 'lucide-react';
import Image from 'next/image';
import { AuthModals } from '../auth/auth-modals';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        if (searchOpen) setSearchOpen(false);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
        if (mobileMenuOpen) setMobileMenuOpen(false);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
    };

    const closeAuthModals = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(false);
    };

    return (
        <>
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center h-16">
                        {/* Mobil Menü Butonu */}
                        <button
                            className="md:hidden mr-3 text-darkgray"
                            onClick={toggleMobileMenu}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image src="/images/logo.png" alt="davetnerede.com" width={40} height={40} />
                            <span className="text-xl sm:text-2xl font-bold text-primary">Davet Nerede?</span>
                        </Link>

                        {/* Mobil Arama Butonu */}
                        <button
                            className="md:hidden ml-auto text-darkgray"
                            onClick={toggleSearch}
                        >
                            {searchOpen ? <X size={24} /> : <Search size={24} />}
                        </button>

                        {/* Arama - Masaüstü */}
                        <div className="hidden md:block flex-1 max-w-xl mx-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Davet Salonu ara"
                                    className="w-full py-2 pl-3 pr-10 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                                />
                                <button className="absolute right-0 top-0 h-full px-3 text-darkgray">
                                    <Search size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Sağ taraf butonları */}
                        <div className="flex items-center md:ml-auto">
                            <div className="flex items-center text-darkgray hover:text-primary px-2 md:px-3">
                                <button onClick={openLoginModal} id="login-button" className="hidden md:block text-sm font-medium mr-1">
                                    GİRİŞ YAP
                                </button>
                                <span className="mx-1 text-darkgray hidden md:block">/</span>
                                <button onClick={openRegisterModal} id="register-button" className="hidden md:block text-sm font-medium">
                                    ÜYE OL
                                </button>
                                <button onClick={openLoginModal} className="md:hidden">
                                    <User size={20} />
                                </button>
                            </div>

                            <Link
                                href="/firmalar-icin"
                                className="hidden md:block ml-2 md:ml-4 inline-flex items-center px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white bg-primary rounded hover:bg-primary/90"
                            >
                                Firmalar İçin
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobil Arama Alanı */}
                <div className={`border-t border-border bg-white overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-16 py-2' : 'max-h-0'}`}>
                    <div className="container mx-auto px-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Davet Salonu ara"
                                className="w-full py-2 pl-3 pr-10 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                            />
                            <button className="absolute right-0 top-0 h-full px-3 text-darkgray">
                                <Search size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobil Menü */}
                <div className={`border-t border-border bg-white overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-112' : 'max-h-0'}`}>
                    <div className="container mx-auto px-4 py-2">
                        <nav className="flex flex-col">
                            <Link href="/davet-salonlari" className="py-2 text-text hover:text-primary">
                                Davet Salonları
                            </Link>
                            <Link href="/organizasyon-firmalari" className="py-2 text-text hover:text-primary">
                                Organizasyon Firmaları
                            </Link>
                            <Link href="/rehber-yazilar" className="py-2 text-text hover:text-primary">
                                Rehber Yazılar
                            </Link>
                            <Link href="/indirimler" className="py-2 text-text hover:text-primary">
                                İndirimler
                            </Link>
                            <Link href="/araclar" className="py-2 text-text hover:text-primary">
                                Araçlar
                            </Link>
                            <Link href="/ucretsiz-dugun-asistani" className="py-2 text-text hover:text-primary">
                                Ücretsiz Düğün Asistanı
                            </Link>
                            <Link href="/firmalar-icin" className="py-2 text-text hover:text-primary">
                                Firmanızı Ekleyin
                            </Link>
                            <div className="pt-2 border-t border-border">
                                <button onClick={openLoginModal} className="py-2 text-text hover:text-primary w-full text-left">
                                    Giriş Yap
                                </button>
                                <button onClick={openRegisterModal} className="py-2 text-text hover:text-primary w-full text-left">
                                    Üye Ol
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Alt Menü */}
                <div className="border-t border-border bg-white">
                    <div className="container mx-auto px-4">
                        <nav className="hidden md:flex items-center overflow-x-auto hide-scrollbar py-2">
                            <Link href="/dugun-mekanlari" className="whitespace-nowrap mr-6 text-sm text-text hover:text-primary py-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 18H10V15C10 14.448 9.552 14 9 14H5C4.448 14 4 14.448 4 15V18H2V9.65L7 4.4L12 9.6V18ZM17 18H15V13C15 10.424 12.649 8 10 8H9.83L12 5.93L22 15.3V18H20V15C20 14.448 19.552 14 19 14H17C16.448 14 16 14.448 16 15V18H17Z" fill="currentColor" />
                                </svg>
                                Davet Salonları
                            </Link>
                            <Link href="/dugun-firmalari" className="whitespace-nowrap mr-6 text-sm text-text hover:text-primary py-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 6H16V5C16 3.34 14.66 2 13 2H11C9.34 2 8 3.34 8 5V6H5C3.9 6 3 6.9 3 8V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V8C21 6.9 20.1 6 19 6ZM10 5C10 4.45 10.45 4 11 4H13C13.55 4 14 4.45 14 5V6H10V5ZM19 20H5V8H19V20Z" fill="currentColor" />
                                </svg>
                                Organizasyon Firmaları
                            </Link>
                            <Link href="/rehber-yazilar" className="whitespace-nowrap mr-6 text-sm text-text hover:text-primary py-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 5V19H5V5H19ZM20.1 3H3.9C3.4 3 3 3.4 3 3.9V20.1C3 20.5 3.4 21 3.9 21H20.1C20.5 21 21 20.5 21 20.1V3.9C21 3.4 20.5 3 20.1 3V3ZM14.5 11.5H16V13H14.5V16H13V13H11.5V11.5H13V9H14.5V11.5ZM9.5 11.5H8V9H11V12.5H9.5V11.5ZM8 16V14.5H11V16H8Z" fill="currentColor" />
                                </svg>
                                Rehber Yazılar
                            </Link>
                            <Link href="/indirimler" className="whitespace-nowrap mr-6 text-sm text-text hover:text-primary py-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z" fill="currentColor" />
                                </svg>
                                İndirimler
                            </Link>
                            <Link href="/gelinlik-modelleri" className="whitespace-nowrap mr-6 text-sm text-text hover:text-primary py-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.07 6.01C8.2 6.01 5.07 9.14 5.07 13.01C5.07 16.88 8.2 20.01 12.07 20.01C15.94 20.01 19.07 16.88 19.07 13.01C19.07 9.14 15.94 6.01 12.07 6.01ZM12.07 18.01C9.3 18.01 7.07 15.78 7.07 13.01C7.07 10.24 9.3 8.01 12.07 8.01C14.84 8.01 17.07 10.24 17.07 13.01C17.07 15.78 14.84 18.01 12.07 18.01ZM12.07 4.01C14.06 4.01 15.97 4.8 17.4 6.22C17.78 6.6 18.41 6.59 18.79 6.2C19.17 5.82 19.16 5.19 18.77 4.81C17.01 3.06 14.63 2.01 12.07 2.01C9.5 2.01 7.12 3.06 5.36 4.81C4.98 5.19 4.97 5.82 5.35 6.2C5.73 6.58 6.36 6.59 6.74 6.22C8.17 4.8 10.07 4.01 12.07 4.01Z" fill="currentColor" />
                                </svg>
                                Nişanlık ve Abiye Modelleri
                            </Link>
                            <Link href="/damatlilik-ve-erkek-takim-elbiseleri" className="whitespace-nowrap mr-6 text-sm text-text hover:text-primary py-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 22h20L12 2ZM12 17L18 9L12 7L6 9L12 17Z" fill="currentColor" />
                                </svg>
                                Takım Elbiseleri
                            </Link>
                            <Link href="/araclar" className="whitespace-nowrap mr-6 text-sm text-text hover:text-primary py-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.7 19L13.6 9.9C14.5 7.6 14 4.9 12.1 3C10.1 1 7.1 0.6 4.7 1.7L9 6L6 9L1.6 4.7C0.4 7.1 0.9 10.1 2.9 12.1C4.8 14 7.5 14.5 9.8 13.6L18.9 22.7C19.3 23.1 19.9 23.1 20.3 22.7L22.6 20.4C23.1 20 23.1 19.3 22.7 19Z" fill="currentColor" />
                                </svg>
                                Araçlar
                            </Link>
                            <Link href="/ucretsiz-dugun-asistani" className="whitespace-nowrap text-sm text-text hover:text-primary py-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
                                </svg>
                                Ücretsiz Ai Davet Asistanı
                            </Link>
                        </nav>
                    </div>
                </div>

                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </header>

            {/* Auth Modals */}
            <AuthModals
                isLoginOpen={isLoginModalOpen}
                isRegisterOpen={isRegisterModalOpen}
                onClose={closeAuthModals}
            />
        </>
    );
} 