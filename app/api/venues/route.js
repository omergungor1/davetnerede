import { getSupabaseServer } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import turkiyeIlIlce from '@/data/turkiye-il-ilce';

export async function GET(request) {
    try {
        const supabase = getSupabaseServer();
        const searchParams = request.nextUrl.searchParams;

        const cityId = searchParams.get('cityId');
        const districtId = searchParams.get('districtId');
        const category = searchParams.get('category');
        const capacity = searchParams.get('capacity');
        const priceRange = searchParams.get('priceRange');
        const features = searchParams.get('features')?.split(',') || [];
        const services = searchParams.get('services')?.split(',') || [];

        let query = supabase
            .from('businesses')
            .select('*, packages(id,name,description,features,is_per_person,price,capacity,isdeleted)')
            .eq('is_active', true);


        // Filtreleri uygula
        if (cityId) query = query.eq('city_id', cityId);
        if (districtId) query = query.eq('district_id', districtId);
        if (category) query = query.eq('category', category);
        if (capacity) {
            const [min, max] = capacity.split('-').map(Number);
            if (min) query = query.gte('capacity', min);
            if (max) query = query.lte('capacity', max);
        }
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            if (min) query = query.gte('min_price', min);
            if (max) query = query.lte('max_price', max);
        }
        if (features.length > 0) {
            query = query.contains('features', features);
        }
        if (services.length > 0) {
            query = query.contains('services', services);
        }

        const { data: venues, error } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({ venues });
    } catch (error) {
        console.error('Mekan listesi getirme hatası:', error);
        return NextResponse.json({ error: 'Mekanlar getirilirken bir hata oluştu' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const supabase = getSupabaseServer();
        const data = await request.json();

        // Gerekli alanların kontrolü
        if (!data.name || !data.city_id || !data.district_id) {
            return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
        }

        const { data: venue, error } = await supabase
            .from('businesses')
            .insert([{
                name: data.name,
                description: data.description,
                city_id: data.city_id,
                city_name: data.city_name,
                district_id: data.district_id,
                district_name: data.district_name,
                address: data.address,
                capacity: data.capacity,
                min_price: data.min_price,
                max_price: data.max_price,
                features: data.features || [],
                services: data.services || [],
                category: data.category,
                is_active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json(venue);
    } catch (error) {
        console.error('Mekan ekleme hatası:', error);
        return NextResponse.json({ error: 'Mekan eklenirken bir hata oluştu' }, { status: 500 });
    }
} 