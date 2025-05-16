"use client";

import { Header } from './header';
import { Footer } from './footer';
import { usePathname } from 'next/navigation';

export function Layout({ children }) {
    const pathname = usePathname();
    const isFirmaProfilPage = pathname === '/firmalar-icin/firma-profil';
    return (
        <div className="flex flex-col min-h-screen">
            {!isFirmaProfilPage && <Header />}
            <main className="flex-1">
                {children}
            </main>
            {!isFirmaProfilPage && <Footer />}
        </div>
    );
} 