"use client";

import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FirmalarIcin() {
    const { user, isCompanyAccount } = useAuth();
    const router = useRouter();

    // Eğer kullanıcı zaten giriş yapmış firma hesabı ise, firma profiline yönlendir
    useEffect(() => {
        if (user && isCompanyAccount()) {
            router.push('/firma-profil');
        }
    }, [user, router]);

    return (
        <Layout>
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Düğün Mekanınızı Tanıtın, Daha Fazla Müşteriye Ulaşın</h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Firmanızı platforma ekleyin, binlerce çiftin mekan arayışında öne çıkın ve daha fazla rezervasyon alın.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/firmalar-icin/kayit">
                                <Button className="w-full sm:w-auto px-8">Hemen Kaydolun</Button>
                            </Link>
                            <Link href="/firmalar-icin/giris">
                                <Button variant="outline" className="w-full sm:w-auto px-8">Giriş Yapın</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Özellikler Bölümü */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Görünürlük Artırın</h3>
                            <p className="text-gray-600">
                                Mekanınızı bölgenizdeki çiftlere tanıtın. Profesyonel profil sayfanızla potansiyel müşterilerin dikkatini çekin.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Rezervasyonları Yönetin</h3>
                            <p className="text-gray-600">
                                Gelen rezervasyon taleplerini kolayca görüntüleyin, onaylayın ve takvim üzerinde takip edin.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Müşterilerle İletişim</h3>
                            <p className="text-gray-600">
                                Potansiyel müşterilerle doğrudan iletişim kurun. Sorulara cevap verin ve teklifler hazırlayın.
                            </p>
                        </div>
                    </div>

                    {/* Nasıl Çalışır Bölümü */}
                    <div className="bg-white p-8 rounded-lg shadow-sm mb-16">
                        <h2 className="text-2xl font-bold mb-8 text-center">Nasıl Çalışır?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                                    1
                                </div>
                                <h3 className="font-semibold mb-2">Ücretsiz Kayıt Olun</h3>
                                <p className="text-gray-600">
                                    Birkaç dakika içinde firma hesabınızı oluşturun ve hemen kullanmaya başlayın.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                                    2
                                </div>
                                <h3 className="font-semibold mb-2">Profilinizi Oluşturun</h3>
                                <p className="text-gray-600">
                                    Firma bilgilerinizi ve mekan detaylarınızı ekleyin, fotoğraflar yükleyin.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">
                                    3
                                </div>
                                <h3 className="font-semibold mb-2">Bağlantı Kurun</h3>
                                <p className="text-gray-600">
                                    Size ulaşan müşterilerle iletişime geçin ve rezervasyonları yönetin.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Bölümü */}
                    <div className="bg-primary/10 p-8 rounded-lg mb-16">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-6 md:mb-0 md:mr-8">
                                <h2 className="text-2xl font-bold mb-3">Hemen Katılın</h2>
                                <p className="text-gray-700 max-w-md">
                                    Çiftlere unutulmaz düğün mekanınızı tanıtın ve işletmenizi büyütün. Başlamak için şimdi kaydolun.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/firmalar-icin/kayit">
                                    <Button className="w-full sm:w-auto px-8">Kayıt Ol</Button>
                                </Link>
                                <Link href="/firmalar-icin/giris">
                                    <Button variant="outline" className="w-full sm:w-auto px-8">Giriş Yap</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
} 