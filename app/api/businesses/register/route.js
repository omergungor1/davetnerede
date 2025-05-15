import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        // İstek verilerini al
        const {
            user_id,
            name,
            description,
            tagline,
            capacity,
            phone,
            email,
            address,
            city_id,
            city_name,
            district_id,
            district_name,
            lat,
            lng,
            features,
            services,
            team_members,
            packages,
            profile_image_url,
            owner_name
        } = await request.json();

        // Doğrulama kontrolleri
        if (!user_id || !name) {
            return NextResponse.json(
                { error: 'Kullanıcı ID ve firma adı gereklidir' },
                { status: 400 }
            );
        }

        // Server tarafı Supabase bağlantısı
        const supabaseServer = createServerSupabaseClient();

        // Yeni bir UUID oluştur
        const business_id = uuidv4();

        // Önce businesses tablosuna kayıt
        const { data: businessData, error: businessError } = await supabaseServer
            .from('businesses')
            .insert({
                id: business_id,
                owner_id: user_id,
                name,
                description,
                capacity,
                phone,
                email,
                address,
                city_id,
                city_name,
                district_id,
                district_name,
                lat,
                lng,
                features,
                services,
                profile_image_url,
                tagline,
                owner_name
            })
            .select('id')
            .single();

        if (businessError) {
            console.error('İşletme oluşturma hatası:', businessError);
            return NextResponse.json(
                { error: businessError.message || 'İşletme oluşturulurken bir hata oluştu' },
                { status: 500 }
            );
        }

        // Ekip üyelerini ekle
        if (team_members && team_members.length > 0) {
            const formattedTeamMembers = team_members.map(member => ({
                name: member.isim,
                position: member.pozisyon,
                phone: member.telefon,
                business_id
            }));

            const { error: teamError } = await supabaseServer
                .from('team_members')
                .insert(formattedTeamMembers);

            if (teamError) {
                console.error('Ekip üyeleri ekleme hatası:', teamError);
                // Hata durumunda işleme devam edilebilir, bu yüzden return yapmıyoruz
            }
        }

        // Paketleri ekle
        if (packages && packages.length > 0) {
            const formattedPackages = packages.map(pkg => ({
                name: pkg.ad,
                description: pkg.aciklama,
                features: pkg.ozellikler,
                price: pkg.fiyat ? parseFloat(pkg.fiyat) : null,
                is_per_person: pkg.fiyat_turu === 'kisiBasina',
                capacity: pkg.kapasite ? parseInt(pkg.kapasite) : null,
                business_id
            }));

            const { error: packageError } = await supabaseServer
                .from('packages')
                .insert(formattedPackages);

            if (packageError) {
                console.error('Paket ekleme hatası:', packageError);
                // Hata durumunda işleme devam edilebilir
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                business_id,
                message: 'İşletme başarıyla kaydedildi'
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