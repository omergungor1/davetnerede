import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request) {
    try {
        // İstek verilerini al
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'E-posta adresi gereklidir' },
                { status: 400 }
            );
        }

        // E-posta adresini temizle
        const cleanEmail = email.trim().toLowerCase().replace(/\s+/g, "").replace(/[\r\n\t]/g, "");

        // Server tarafı Supabase bağlantısı
        const supabaseServer = createServerSupabaseClient();

        // Kullanıcı listesini al
        const { data: userData, error: listError } = await supabaseServer.auth.admin.listUsers();

        if (listError) {
            console.error('Kullanıcı listesi alınamadı:', listError);
            return NextResponse.json(
                { error: 'Kullanıcı doğrulanırken bir hata oluştu' },
                { status: 500 }
            );
        }

        // E-postaya göre kullanıcıyı bul
        const user = userData?.users?.find(u => u.email === cleanEmail);

        if (!user) {
            return NextResponse.json(
                { error: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        // E-posta doğrulama işlemini yap
        const { data, error } = await supabaseServer.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
        );

        if (error) {
            console.error('Kullanıcı doğrulama hatası:', error);
            return NextResponse.json(
                { error: error.message || 'Kullanıcı doğrulanırken bir hata oluştu' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            data: {
                message: 'Kullanıcı e-postası başarıyla doğrulandı',
                user: {
                    id: data.user.id,
                    email: data.user.email
                }
            }
        });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json(
            { error: 'İşlem sırasında bir hata oluştu' },
            { status: 500 }
        );
    }
} 