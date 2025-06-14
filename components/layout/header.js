"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Search, Heart, Menu, User, X, MapPin, LogOut, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { AuthModals } from '../auth/auth-modals';
import { useLocation } from '../../app/context/location-context';
import { useAuth } from '@/app/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { location, setLocation } = useLocation();
    const { user, signOut, isCompanyAccount } = useAuth();
    const userMenuRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();

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

    // Kullanıcı adını göstermek için
    const getUserDisplayName = () => {
        if (!user) return '';
        return user.user_metadata?.full_name || user.email;
    };

    // Kullanıcı avatarı için
    const getInitials = () => {
        if (!user) return 'K';

        const fullName = user.user_metadata?.full_name;

        if (fullName) {
            // Ad ve soyad olarak böl
            const nameParts = fullName.split(' ');

            if (nameParts.length > 1) {
                // İlk ve son kelimenin ilk harflerini al
                return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
            } else {
                // Sadece ilk harfi al
                return fullName.charAt(0).toUpperCase();
            }
        } else {
            return user.email?.charAt(0).toUpperCase() || 'K';
        }
    };

    // Çıkış işlemi
    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Çıkış hatası:', error);
            toast.error('Çıkış yapılırken bir hata oluştu');
        }
    };

    // Menü dışına tıklandığında menüyü kapat
    useEffect(() => {
        // Menüyü kapatmak için dışarı tıklamayı dinle
        const handleClickOutside = (event) => {
            if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userMenuOpen]);

    // Aktif menü öğesini belirlemek için yardımcı fonksiyon
    const isActivePath = (path) => {
        return pathname === path;
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
                            <Image src="/images/logo.png" alt="davetevibul logo" width={40} height={40} />
                            <span className="text-xl sm:text-2xl font-bold text-primary">Davet Evi Bul</span>
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
                                    placeholder="Davet Evi Ara"
                                    className="w-full py-2 pl-3 pr-10 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
                                />
                                <button className="absolute right-0 top-0 h-full px-3 text-darkgray">
                                    <Search size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Sağ taraf butonları */}
                        <div className="flex items-center md:ml-auto">
                            {user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center ml-2 md:ml-4 gap-2 px-1 py-1 rounded-full hover:bg-gray-100"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">
                                            {getInitials()}
                                        </div>
                                        <span className="hidden md:block text-sm font-medium">
                                            {getUserDisplayName()}
                                        </span>
                                        <ChevronDown size={16} className="hidden md:block text-gray-500" />
                                    </button>

                                    {/* Kullanıcı Dropdown Menüsü */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                <div className="block px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                                                    <div className="font-medium">{getUserDisplayName()}</div>
                                                    <div className="text-gray-500 truncate">{user.email}</div>
                                                </div>

                                                {isCompanyAccount() ? (
                                                    // İşletme Hesabı Menüsü
                                                    <>
                                                        <Link
                                                            href="/firmalar-icin/firma-profil"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => setUserMenuOpen(false)}
                                                        >
                                                            Firma Bilgileri
                                                        </Link>
                                                        <Link
                                                            href="/firmalar-icin/firma-profil?tab=teklifler"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => setUserMenuOpen(false)}
                                                        >
                                                            Teklifler
                                                        </Link>
                                                        <Link
                                                            href="/firmalar-icin/firma-profil?tab=rezervasyonlar"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => setUserMenuOpen(false)}
                                                        >
                                                            Rezervasyonlar
                                                        </Link>
                                                        <Link
                                                            href="/firmalar-icin/firma-profil?tab=randevular"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => setUserMenuOpen(false)}
                                                        >
                                                            Randevular
                                                        </Link>
                                                        <Link
                                                            href="/firmalar-icin/firma-profil?tab=sorucevap"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => setUserMenuOpen(false)}
                                                        >
                                                            Soru-Cevap
                                                        </Link>
                                                        <Link
                                                            href="/firmalar-icin/firma-profil?tab=yorumlar"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            onClick={() => setUserMenuOpen(false)}
                                                        >
                                                            Yorumlar
                                                        </Link>
                                                    </>
                                                ) : (
                                                    // Normal Kullanıcı Menüsü
                                                    <>
                                                        <Link
                                                            href="/"
                                                            className={`block px-4 py-2 text-sm ${isActivePath('/') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                                        >
                                                            Davet Evi Bul
                                                        </Link>
                                                        <Link
                                                            href="/hesabim/profil"
                                                            className={`block px-4 py-2 text-sm ${isActivePath('/hesabim/profil') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                                        >
                                                            Profil Bilgilerim
                                                        </Link>
                                                        <Link
                                                            href="/hesabim/teklifler"
                                                            className={`block px-4 py-2 text-sm ${isActivePath('/hesabim/teklifler') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                                        >
                                                            Tekliflerim
                                                        </Link>
                                                        <Link
                                                            href="/hesabim/randevular"
                                                            className={`block px-4 py-2 text-sm ${isActivePath('/hesabim/randevular') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                                        >
                                                            Randevularım
                                                        </Link>
                                                        <Link
                                                            href="/hesabim/rezervasyonlar"
                                                            className={`block px-4 py-2 text-sm ${isActivePath('/hesabim/rezervasyonlar') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                                        >
                                                            Rezervasyonlarım
                                                        </Link>
                                                        <Link
                                                            href="/hesabim/favoriler"
                                                            className={`block px-4 py-2 text-sm ${isActivePath('/hesabim/favoriler') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                                        >
                                                            Favorilerim
                                                        </Link>
                                                    </>
                                                )}

                                                <button
                                                    onClick={handleSignOut}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-200"
                                                >
                                                    <div className="flex items-center">
                                                        <LogOut size={16} className="mr-2" />
                                                        Çıkış Yap
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
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
                                </>
                            )}

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
                            <button className="absolute right-0 top-0 h-full px-3 text-primary">
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
                            {/* <Link href="/rehber-yazilar" className="py-2 text-text hover:text-primary">
                                Rehber Yazılar
                            </Link> */}
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
                                {user ? (
                                    <>
                                        <Link
                                            href="/hesabim/profil"
                                            className={`py-2 block ${isActivePath('/hesabim/profil') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                        >
                                            Profil Bilgilerim
                                        </Link>
                                        <Link
                                            href="/hesabim/teklifler"
                                            className={`py-2 block ${isActivePath('/hesabim/teklifler') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                        >
                                            Tekliflerim
                                        </Link>
                                        <Link
                                            href="/hesabim/randevular"
                                            className={`py-2 block ${isActivePath('/hesabim/randevular') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                        >
                                            Randevularım
                                        </Link>
                                        <Link
                                            href="/hesabim/rezervasyonlar"
                                            className={`py-2 block ${isActivePath('/hesabim/rezervasyonlar') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                        >
                                            Rezervasyonlarım
                                        </Link>
                                        <Link
                                            href="/hesabim/favoriler"
                                            className={`py-2 block ${isActivePath('/hesabim/favoriler') ? 'text-primary font-medium' : 'text-text hover:text-primary'}`}
                                        >
                                            Favorilerim
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="py-2 text-red-600 hover:text-red-700 w-full text-left flex items-center"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Çıkış Yap
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={openLoginModal} className="py-2 text-text hover:text-primary w-full text-left">
                                            Giriş Yap
                                        </button>
                                        <button onClick={openRegisterModal} className="py-2 text-text hover:text-primary w-full text-left">
                                            Üye Ol
                                        </button>
                                    </>
                                )}
                            </div>
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