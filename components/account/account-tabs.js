"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Calendar, FileText, BookOpen } from 'lucide-react';

export function AccountTabs() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('');

    // Tab'ları tanımla
    const tabs = [
        {
            name: 'Profil Bilgilerim',
            path: '/hesabim/profil',
            icon: <User size={20} />
        },
        {
            name: 'Tekliflerim',
            path: '/hesabim/teklifler',
            icon: <FileText size={20} />
        },
        {
            name: 'Randevularım',
            path: '/hesabim/randevular',
            icon: <Calendar size={20} />
        },
        {
            name: 'Rezervasyonlarım',
            path: '/hesabim/rezervasyonlar',
            icon: <BookOpen size={20} />
        }
    ];

    // Aktif tab'ı sayfa yüklendikçe güncelle
    useEffect(() => {
        // Mevcut yol ile eşleşen tab'ı bul
        const currentTab = tabs.find(tab => pathname.startsWith(tab.path));
        if (currentTab) {
            setActiveTab(currentTab.path);
        }
    }, [pathname]);

    return (
        <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="overflow-x-auto">
                <nav className="flex border-b border-gray-100">
                    {tabs.map(tab => (
                        <Link
                            key={tab.path}
                            href={tab.path}
                            className={`flex items-center px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.path
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-darkgray hover:text-primary hover:bg-gray-50'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
} 