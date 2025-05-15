"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CallMeForm } from '@/components/ui/call-me-form';

export function FirmalarHeader() {
    const [modalOpen, setModalOpen] = useState(false);

    const handleCallMeSuccess = (formData) => {
        console.log('Form bilgileri:', formData);
        // Burada form verileriyle ilgili ek işlemler yapılabilir
    };

    return (
        <header className="bg-white shadow-sm py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link href="/" className="flex items-center">
                        <Image src="/images/logo.png" alt="Davet Evi Bul Logo" width={36} height={36} />
                        <span className="text-lg sm:text-xl font-bold text-primary ml-2">Davet Evi Bul</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button
                            onClick={() => setModalOpen(true)}
                            variant="outline"
                            className="text-xs sm:text-sm border-primary text-primary hover:bg-primary hover:text-white px-2 sm:px-4 py-1 sm:py-2 w-28 sm:w-32 h-8 sm:h-10 flex justify-center items-center"
                        >
                            Sizi Arayalım
                        </Button>
                        <Link
                            href="/firmalar-icin/giris"
                            className="text-xs sm:text-sm bg-primary text-white px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-primary/90 transition-colors w-28 sm:w-32 h-8 sm:h-10 flex justify-center items-center"
                        >
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sizi Arayalım Modal Komponenti */}
            <CallMeForm
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleCallMeSuccess}
            />
        </header>
    );
} 