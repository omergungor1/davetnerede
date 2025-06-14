import { getSupabaseServer } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const supabase = getSupabaseServer();
        const data = await request.json();

        // Gerekli alanların kontrolü
        if (!data.email || !data.password || !data.name) {
            return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
        }

        // 1. Auth kullanıcısı oluştur
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true,
            user_metadata: {
                full_name: data.name,
                user_type: 'company'
            }
        });

        if (authError) {
            throw authError;
        }

        // 2. Businesses tablosuna kayıt ekle
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .insert([{
                owner_id: authData.user.id,
                name: data.name,
                email: data.email,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (businessError) {
            // Hata durumunda auth kullanıcısını sil
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw businessError;
        }

        return NextResponse.json({
            message: 'İşletme hesabı başarıyla oluşturuldu',
            user: authData.user,
            business
        });

    } catch (error) {
        console.error('İşletme kayıt hatası:', error);
        return NextResponse.json({
            error: error.message || 'İşletme kaydı sırasında bir hata oluştu'
        }, { status: 500 });
    }
} 