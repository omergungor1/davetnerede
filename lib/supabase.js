import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// CLIENT COMPONENTS: Client component'lerde kullanılacak Supabase istemcisi
export const supabase = createClientComponentClient();

// SERVER-SIDE: Server tarafında auth olmadan kullanılacak istemci
export function getSupabaseServer() {
    if (typeof window !== 'undefined') {
        throw new Error('getSupabaseServer sadece server-side kodlarda kullanılabilir');
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}