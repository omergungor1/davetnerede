import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function PUT(request) {
    try {
        // İstek verilerini al
        const data = await request.json();
        const { userId, profileData } = data;

        if (!userId || !profileData) {
            return NextResponse.json(
                { error: 'Kullanıcı ID ve profil verileri gereklidir' },
                { status: 400 }
            );
        }

        // Server tarafı Supabase bağlantısı
        const supabaseServer = createServerSupabaseClient();

        // Profiles tablosunu güncelle
        const { error: profileError } = await supabaseServer
            .from('profiles')
            .upsert({
                id: userId,
                full_name: profileData.full_name,
                email: profileData.email, // E-posta değiştirilemiyor
                phone: profileData.phone,
                city_id: profileData.city_id,
                city_name: profileData.city_name,
                district_id: profileData.district_id,
                district_name: profileData.district_name,
                updated_at: new Date().toISOString()
            });

        if (profileError) {
            console.error('Profil güncelleme hatası (API):', profileError);
            return NextResponse.json(
                { error: 'Profil güncellenirken bir hata oluştu' },
                { status: 500 }
            );
        }

        // Auth metadatasını güncelle
        const { error: authError } = await supabaseServer.auth.admin.updateUserById(userId, {
            user_metadata: {
                full_name: profileData.full_name,
                phone: profileData.phone,
                city_id: profileData.city_id,
                city_name: profileData.city_name,
                district_id: profileData.district_id,
                district_name: profileData.district_name
            }
        });

        if (authError) {
            console.error('Auth güncelleme hatası (API):', authError);
            return NextResponse.json(
                { error: 'Kimlik bilgileri güncellenirken bir hata oluştu' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Profil başarıyla güncellendi'
        });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json(
            { error: 'İşlem sırasında bir hata oluştu' },
            { status: 500 }
        );
    }
} 