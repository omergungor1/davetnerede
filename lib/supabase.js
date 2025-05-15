import { createClient } from '@supabase/supabase-js'

// Client tarafı için (browser'da çalışır)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Server tarafı için (sadece API route'larda çalışır)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Client tarafı için Supabase istemcisi
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server tarafı için Supabase admin istemcisi
// ÖNEMLİ: Bu istemci sadece API route'larda kullanılmalıdır!
export const createServerSupabaseClient = () => {
    return createClient(
        supabaseUrl,
        supabaseServiceKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
} 