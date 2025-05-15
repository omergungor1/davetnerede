import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request) {
    try {
        // İstek verilerini al
        const { email, password, metadata = {}, userType = 'user' } = await request.json();

        // Doğrulama kontrolleri
        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-posta ve şifre gereklidir' },
                { status: 400 }
            );
        }

        // E-posta adresini temizle
        const cleanEmail = email.trim().toLowerCase().replace(/\s+/g, "").replace(/[\r\n\t]/g, "");

        // E-posta formatı kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            return NextResponse.json(
                { error: 'Geçersiz e-posta formatı' },
                { status: 400 }
            );
        }

        // User_type metadata'ya ekleyelim
        const updatedMetadata = {
            ...metadata,
            user_type: userType
        };

        // Server tarafı Supabase bağlantısı
        const supabaseServer = createServerSupabaseClient();

        // Admin API ile otomatik onaylı kullanıcı oluştur
        const { data, error } = await supabaseServer.auth.admin.createUser({
            email: cleanEmail,
            password: password.trim(),
            email_confirm: true,
            user_metadata: updatedMetadata
        });

        if (error) {
            console.error('Kullanıcı oluşturma hatası:', error);
            return NextResponse.json(
                { error: error.message || 'Kullanıcı oluşturulurken bir hata oluştu' },
                { status: 500 }
            );
        }

        // Profil tablosuna kayıt
        if (data.user) {
            const profileData = {
                id: data.user.id,
                full_name: updatedMetadata.full_name || '',
                email: cleanEmail,
                phone: updatedMetadata.phone || '',
                city_id: updatedMetadata.city_id || null,
                city_name: updatedMetadata.city_name || '',
                district_id: updatedMetadata.district_id || null,
                district_name: updatedMetadata.district_name || '',
                user_type: userType,
                created_at: new Date().toISOString()
            };

            const { error: profileError } = await supabaseServer
                .from('profiles')
                .insert([profileData]);

            if (profileError) {
                console.error('Profil oluşturma hatası:', profileError);
                // Profil oluşturma hatası durumunda oluşturulan kullanıcıyı silmek isteyebilirsiniz
                // await supabaseServer.auth.admin.deleteUser(data.user.id);
                return NextResponse.json(
                    { error: 'Profil oluşturulurken bir hata oluştu' },
                    { status: 500 }
                );
            }
        }

        // Başarılı yanıt dön (şifre geri dönme)
        const safeUserData = { ...data };
        if (safeUserData.user) {
            delete safeUserData.user.password;
        }

        return NextResponse.json({ data: safeUserData });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json(
            { error: 'İşlem sırasında bir hata oluştu' },
            { status: 500 }
        );
    }
} 