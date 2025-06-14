import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    get(name) {
                        const cookie = cookieStore.get(name);
                        return cookie?.value;
                    },
                    set(name, value, options) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name, options) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

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

        // Randevuları getir
        const { data: appointments, error: appointmentsError } = await supabase
            .from('appointments')
            .select('*')
            .eq('business_id', params.id)
            .eq('isdeleted', false)
            .order('appointment_date', { ascending: true });

        if (appointmentsError) {
            return NextResponse.json({ error: 'Randevular getirilemedi' }, { status: 500 });
        }

        return NextResponse.json(appointments);
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    get(name) {
                        const cookie = cookieStore.get(name);
                        return cookie?.value;
                    },
                    set(name, value, options) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name, options) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );
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

        // Yeni randevu oluştur
        const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .insert({
                business_id: params.id,
                profile_id: body.profile_id,
                customer_name: body.customer_name,
                phone: body.phone,
                appointment_date: body.appointment_date,
                appointment_time: body.appointment_time,
                status: body.status || 'Beklemede'
            })
            .select()
            .single();

        if (appointmentError) {
            return NextResponse.json({ error: 'Randevu oluşturulamadı' }, { status: 500 });
        }

        return NextResponse.json(appointment);
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    get(name) {
                        const cookie = cookieStore.get(name);
                        return cookie?.value;
                    },
                    set(name, value, options) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name, options) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );
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

        // Randevuyu güncelle
        const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .update({
                appointment_date: body.appointment_date,
                appointment_time: body.appointment_time,
                status: body.status,
                updated_at: new Date().toISOString()
            })
            .eq('id', body.id)
            .eq('business_id', params.id)
            .select()
            .single();

        if (appointmentError) {
            return NextResponse.json({ error: 'Randevu güncellenemedi' }, { status: 500 });
        }

        return NextResponse.json(appointment);
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    get(name) {
                        const cookie = cookieStore.get(name);
                        return cookie?.value;
                    },
                    set(name, value, options) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name, options) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );
        const { searchParams } = new URL(request.url);
        const appointmentId = searchParams.get('id');

        if (!appointmentId) {
            return NextResponse.json({ error: 'Randevu ID gerekli' }, { status: 400 });
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

        // Randevuyu sil (soft delete)
        const { error: deleteError } = await supabase
            .from('appointments')
            .update({ isdeleted: true, updated_at: new Date().toISOString() })
            .eq('id', appointmentId)
            .eq('business_id', params.id);

        if (deleteError) {
            return NextResponse.json({ error: 'Randevu silinemedi' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 