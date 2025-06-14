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

        // Soruları getir
        const { data: questions, error: questionsError } = await supabase
            .from('questions')
            .select(`
                *,
                profiles:profile_id (full_name)
            `)
            .eq('business_id', params.id)
            .eq('isdeleted', false)
            .order('created_at', { ascending: false });

        if (questionsError) {
            return NextResponse.json({ error: 'Sorular getirilemedi' }, { status: 500 });
        }

        // Profil bilgilerini düzenle
        const formattedQuestions = questions.map(question => ({
            id: question.id,
            business_id: question.business_id,
            profile_id: question.profile_id,
            musteri: question.profiles?.full_name || 'Anonim',
            tarih: new Date(question.created_at).toLocaleDateString('tr-TR'),
            soru: question.question,
            cevap: question.answer,
            isdeleted: question.isdeleted
        }));

        return NextResponse.json(formattedQuestions);
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

        // Yeni soru oluştur
        const { data: question, error: questionError } = await supabase
            .from('questions')
            .insert({
                business_id: params.id,
                profile_id: body.profile_id,
                question: body.question,
                answer: body.answer
            })
            .select()
            .single();

        if (questionError) {
            return NextResponse.json({ error: 'Soru oluşturulamadı' }, { status: 500 });
        }

        return NextResponse.json(question);
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

        // Soruyu güncelle
        const { data: question, error: questionError } = await supabase
            .from('questions')
            .update({
                answer: body.answer,
                updated_at: new Date().toISOString()
            })
            .eq('id', body.id)
            .eq('business_id', params.id)
            .select()
            .single();

        if (questionError) {
            return NextResponse.json({ error: 'Soru güncellenemedi' }, { status: 500 });
        }

        return NextResponse.json(question);
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
        const questionId = searchParams.get('id');

        if (!questionId) {
            return NextResponse.json({ error: 'Soru ID gerekli' }, { status: 400 });
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

        // Soruyu sil (soft delete)
        const { error: deleteError } = await supabase
            .from('questions')
            .update({ isdeleted: true, updated_at: new Date().toISOString() })
            .eq('id', questionId)
            .eq('business_id', params.id);

        if (deleteError) {
            return NextResponse.json({ error: 'Soru silinemedi' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 