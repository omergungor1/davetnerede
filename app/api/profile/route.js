import { getSupabaseServer } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const supabase = getSupabaseServer();
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json({ error: 'Yetkilendirme başlığı eksik' }, { status: 401 });
        }

        // Bearer token'ı ayıkla
        const token = authHeader.replace('Bearer ', '');

        // Token ile kullanıcı bilgilerini al
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
        }

        // Kullanıcı tipine göre profil bilgilerini getir
        const isCompany = user.user_metadata?.user_type === 'company';
        let profileData;

        if (isCompany) {
            // İşletme profili
            const { data: business, error: businessError } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (businessError) {
                throw businessError;
            }

            profileData = {
                ...business,
                email: user.email,
                user_type: 'company'
            };
        } else {
            // Normal kullanıcı profili
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) {
                throw profileError;
            }

            profileData = {
                ...profile,
                email: user.email,
                user_type: 'user'
            };
        }

        return NextResponse.json({ data: profileData });

    } catch (error) {
        console.error('Profil getirme hatası:', error);
        return NextResponse.json({ error: 'Profil bilgileri alınamadı' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const supabase = getSupabaseServer();
        const authHeader = request.headers.get('authorization');
        const data = await request.json();

        if (!authHeader) {
            return NextResponse.json({ error: 'Yetkilendirme başlığı eksik' }, { status: 401 });
        }

        // Bearer token'ı ayıkla
        const token = authHeader.replace('Bearer ', '');

        // Token ile kullanıcı bilgilerini al
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
        }

        // Kullanıcı tipine göre profil güncelle
        const isCompany = user.user_metadata?.user_type === 'company';
        let updatedProfile;

        if (isCompany) {
            // İşletme profilini güncelle
            const { data: business, error: businessError } = await supabase
                .from('businesses')
                .update({
                    name: data.name,
                    phone: data.phone,
                    address: data.address,
                    city_id: data.city_id,
                    city_name: data.city_name,
                    district_id: data.district_id,
                    district_name: data.district_name,
                    description: data.description,
                    features: data.features,
                    services: data.services,
                    updated_at: new Date().toISOString()
                })
                .eq('owner_id', user.id)
                .select()
                .single();

            if (businessError) {
                throw businessError;
            }

            updatedProfile = {
                ...business,
                email: user.email,
                user_type: 'company'
            };
        } else {
            // Normal kullanıcı profilini güncelle
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: data.full_name,
                    phone: data.phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (profileError) {
                throw profileError;
            }

            updatedProfile = {
                ...profile,
                email: user.email,
                user_type: 'user'
            };
        }

        return NextResponse.json({ data: updatedProfile });

    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        return NextResponse.json({ error: 'Profil güncellenirken bir hata oluştu' }, { status: 500 });
    }
} 