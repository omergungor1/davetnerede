"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-background border-t mt-10">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between mb-8">
                    <div>
                        <Link href="/" className="flex items-center mb-4">
                            <img src="/images/logo.png" alt="davetnerede.com" className="w-10 h-10" />
                            <span className="text-primary font-bold text-2xl">davetnerede</span>
                        </Link>
                        <p className="text-sm text-darkgray mb-4 max-w-md">
                            Düğün ve davet mekanlarını kolayca bulabileceğiniz, fiyat teklifi alabileceğiniz platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-8 md:mt-0">
                        <div>
                            <h3 className="font-semibold mb-3 text-sm text-text">Firmalar İçin</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">Hakkımızda</Link></li>
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">İletişim</Link></li>
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">Gizlilik ve Kullanım</Link></li>
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">Site Haritası</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3 text-sm text-text">Şehirler</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">İstanbul</Link></li>
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">Ankara</Link></li>
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">İzmir</Link></li>
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">Bursa</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3 text-sm text-text">Popüler Alanlar</h3>
                            <ul className="space-y-2">
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">Düğün Mekanları</Link></li>
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">Düğün Fotoğrafçıları</Link></li>
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">Gelinlik Modelleri</Link></li>
                                <li><Link href="#" className="text-sm text-darkgray hover:text-primary">Düğün Organizasyon</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t">
                    <p className="text-xs text-darkgray">
                        © 2023-2024 Davetnerede.com Tüm hakları saklıdır. (H474-4307)
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="#" className="text-darkgray hover:text-primary">
                            <Instagram size={18} />
                        </Link>
                        <Link href="#" className="text-darkgray hover:text-primary">
                            <Facebook size={18} />
                        </Link>
                        <Link href="#" className="text-darkgray hover:text-primary">
                            <Youtube size={18} />
                        </Link>
                        <Link href="#" className="text-darkgray hover:text-primary">
                            <Twitter size={18} />
                        </Link>
                        <Link href="#" className="text-darkgray hover:text-primary">
                            <Linkedin size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}