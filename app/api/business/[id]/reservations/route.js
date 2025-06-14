import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Kullanıcı kontrolü
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // İşletme kontrolü
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('owner_id', user.id)
            .eq('id', params.id)
            .single();

        if (businessError || !business) {
            return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 });
        }

        // Rezervasyonları getir
        const { data: reservations, error: reservationsError } = await supabase
            .from('reservations')
            .select(`
                *,
                packages:package_id (name)
            `)
            .eq('business_id', params.id)
            .eq('isdeleted', false)
            .order('event_date', { ascending: true });

        if (reservationsError) {
            return NextResponse.json({ error: 'Rezervasyonlar getirilemedi' }, { status: 500 });
        }

        return NextResponse.json(reservations);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const body = await request.json();

        // Kullanıcı kontrolü
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // İşletme kontrolü
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('owner_id', user.id)
            .eq('id', params.id)
            .single();

        if (businessError || !business) {
            return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 });
        }

        // Yeni rezervasyon oluştur
        const { data: reservation, error: reservationError } = await supabase
            .from('reservations')
            .insert({
                business_id: params.id,
                profile_id: body.profile_id,
                package_id: body.package_id,
                customer_name: body.customer_name,
                phone: body.phone,
                event_date: body.event_date,
                guest_count: body.guest_count,
                payment_status: body.payment_status || 'Beklemede',
                amount: body.amount,
                type: body.type || 'Ön Rezervasyon'
            })
            .select()
            .single();

        if (reservationError) {
            return NextResponse.json({ error: 'Rezervasyon oluşturulamadı' }, { status: 500 });
        }

        return NextResponse.json(reservation);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const body = await request.json();

        // Kullanıcı kontrolü
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // İşletme kontrolü
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('owner_id', user.id)
            .eq('id', params.id)
            .single();

        if (businessError || !business) {
            return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 });
        }

        // Rezervasyonu güncelle
        const { data: reservation, error: reservationError } = await supabase
            .from('reservations')
            .update({
                package_id: body.package_id,
                event_date: body.event_date,
                guest_count: body.guest_count,
                payment_status: body.payment_status,
                amount: body.amount,
                type: body.type,
                updated_at: new Date().toISOString()
            })
            .eq('id', body.id)
            .eq('business_id', params.id)
            .select()
            .single();

        if (reservationError) {
            return NextResponse.json({ error: 'Rezervasyon güncellenemedi' }, { status: 500 });
        }

        return NextResponse.json(reservation);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { searchParams } = new URL(request.url);
        const reservationId = searchParams.get('id');

        if (!reservationId) {
            return NextResponse.json({ error: 'Rezervasyon ID gerekli' }, { status: 400 });
        }

        // Kullanıcı kontrolü
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // İşletme kontrolü
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('owner_id', user.id)
            .eq('id', params.id)
            .single();

        if (businessError || !business) {
            return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 });
        }

        // Rezervasyonu sil (soft delete)
        const { error: deleteError } = await supabase
            .from('reservations')
            .update({ isdeleted: true, updated_at: new Date().toISOString() })
            .eq('id', reservationId)
            .eq('business_id', params.id);

        if (deleteError) {
            return NextResponse.json({ error: 'Rezervasyon silinemedi' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 