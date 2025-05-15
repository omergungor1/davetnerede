import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request) {
    try {
        // URL'den kullanıcı ID'sini al
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'Kullanıcı ID gereklidir' },
                { status: 400 }
            );
        }

        // Server tarafı Supabase bağlantısı
        const supabaseServer = createServerSupabaseClient();

        // Profiles tablosundan veri çek
        const { data, error } = await supabaseServer
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Profil veri çekme hatası (API):', error);
            return NextResponse.json(
                { error: 'Profil bilgileri alınırken bir hata oluştu' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json(
            { error: 'İşlem sırasında bir hata oluştu' },
            { status: 500 }
        );
    }
} 