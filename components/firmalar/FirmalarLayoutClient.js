'use client';

import { usePathname } from 'next/navigation';
import { FirmalarHeader } from './header';
import { FirmalarFooter } from './footer';

export default function FirmalarLayoutClient({ children }) {
    const pathname = usePathname();
    const isRegisterPage = pathname === '/firmalar-icin/kayit';
    const isLoginPage = pathname === '/firmalar-icin/giris';

    return (
        <>
            {(!isRegisterPage && !isLoginPage) && <FirmalarHeader />}
            {children}
            {(!isRegisterPage && !isLoginPage) && <FirmalarFooter />}
        </>
    );
} 