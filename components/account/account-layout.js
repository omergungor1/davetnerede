"use client";

import { useAuth } from '@/app/context/auth-context';
import { Layout } from '@/components/layout';
import { AccountTabs } from './account-tabs';
import Link from 'next/link';

export function AccountLayout({ children, title }) {
    const { user } = useAuth();

    if (!user) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
                        <h1 className="text-xl font-semibold mb-4">Oturum Açılmamış</h1>
                        <p className="mb-6 text-darkgray">
                            Bu sayfayı görüntülemek için lütfen giriş yapın.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/" className="text-primary font-medium hover:underline">
                                Ana Sayfaya Dön
                            </Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <div className="mx-auto max-w-4xl">
                    <AccountTabs />

                    <div className="bg-white rounded-lg shadow-sm">
                        {title && <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-100">{title}</h2>}
                        {children}
                    </div>
                </div>
            </div>
        </Layout>
    );
} 