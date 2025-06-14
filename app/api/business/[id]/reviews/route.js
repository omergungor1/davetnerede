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

        // Yorumları getir
        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select(`
                *,
                profiles:profile_id (full_name)
            `)
            .eq('business_id', params.id)
            .eq('isdeleted', false)
            .order('created_at', { ascending: false });

        if (reviewsError) {
            return NextResponse.json({ error: 'Yorumlar getirilemedi' }, { status: 500 });
        }

        // Profil bilgilerini düzenle
        const formattedReviews = reviews.map(review => ({
            id: review.id,
            business_id: review.business_id,
            profile_id: review.profile_id,
            musteri: review.profiles?.full_name || 'Anonim',
            tarih: new Date(review.created_at).toLocaleDateString('tr-TR'),
            puan: review.rating,
            comment: review.comment,
            answer: review.answer,
            isdeleted: review.isdeleted
        }));

        return NextResponse.json(formattedReviews);
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

        // Yeni yorum oluştur
        const { data: review, error: reviewError } = await supabase
            .from('reviews')
            .insert({
                business_id: params.id,
                profile_id: body.profile_id,
                rating: body.rating,
                comment: body.comment,
                answer: body.answer
            })
            .select()
            .single();

        if (reviewError) {
            return NextResponse.json({ error: 'Yorum oluşturulamadı' }, { status: 500 });
        }

        return NextResponse.json(review);
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

        // Yorumu güncelle
        const { data: review, error: reviewError } = await supabase
            .from('reviews')
            .update({
                answer: body.answer,
                updated_at: new Date().toISOString()
            })
            .eq('id', body.id)
            .eq('business_id', params.id)
            .select()
            .single();

        if (reviewError) {
            return NextResponse.json({ error: 'Yorum güncellenemedi' }, { status: 500 });
        }

        return NextResponse.json(review);
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
        const reviewId = searchParams.get('id');

        if (!reviewId) {
            return NextResponse.json({ error: 'Yorum ID gerekli' }, { status: 400 });
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

        // Yorumu sil (soft delete)
        const { error: deleteError } = await supabase
            .from('reviews')
            .update({ isdeleted: true, updated_at: new Date().toISOString() })
            .eq('id', reviewId)
            .eq('business_id', params.id);

        if (deleteError) {
            return NextResponse.json({ error: 'Yorum silinemedi' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 