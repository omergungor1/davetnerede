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

        // Teklifleri getir
        const { data: offers, error: offersError } = await supabase
            .from('offers')
            .select(`
                *,
                packages:package_id (name)
            `)
            .eq('business_id', params.id)
            .eq('isdeleted', false)
            .order('created_at', { ascending: false });

        if (offersError) {
            return NextResponse.json({ error: 'Teklifler getirilemedi' }, { status: 500 });
        }

        return NextResponse.json(offers);
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

        // Yeni teklif oluştur
        const { data: offer, error: offerError } = await supabase
            .from('offers')
            .insert({
                business_id: params.id,
                profile_id: body.profile_id,
                package_id: body.package_id,
                customer_name: body.customer_name,
                phone: body.phone,
                price: body.price,
                status: body.status || 'Beklemede',
                offer_date: body.offer_date
            })
            .select()
            .single();

        if (offerError) {
            return NextResponse.json({ error: 'Teklif oluşturulamadı' }, { status: 500 });
        }

        return NextResponse.json(offer);
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

        // Teklifi güncelle
        const { data: offer, error: offerError } = await supabase
            .from('offers')
            .update({
                package_id: body.package_id,
                price: body.price,
                status: body.status,
                updated_at: new Date().toISOString()
            })
            .eq('id', body.id)
            .eq('business_id', params.id)
            .select()
            .single();

        if (offerError) {
            return NextResponse.json({ error: 'Teklif güncellenemedi' }, { status: 500 });
        }

        return NextResponse.json(offer);
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const supabase = createRouteHandlerClient({ cookies });
        const { searchParams } = new URL(request.url);
        const offerId = searchParams.get('id');

        if (!offerId) {
            return NextResponse.json({ error: 'Teklif ID gerekli' }, { status: 400 });
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

        // Teklifi sil (soft delete)
        const { error: deleteError } = await supabase
            .from('offers')
            .update({ isdeleted: true, updated_at: new Date().toISOString() })
            .eq('id', offerId)
            .eq('business_id', params.id);

        if (deleteError) {
            return NextResponse.json({ error: 'Teklif silinemedi' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 