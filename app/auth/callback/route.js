import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (code) {
        try {
            await supabase.auth.exchangeCodeForSession(code);
            return NextResponse.redirect(new URL('/', url.origin));
        } catch (error) {
            console.error('Kod değişimi sırasında hata:', error);
            return NextResponse.redirect(
                new URL('/auth/error?message=Auth işlemi başarısız oldu', url.origin)
            );
        }
    }

    return NextResponse.redirect(new URL('/', url.origin));
} 