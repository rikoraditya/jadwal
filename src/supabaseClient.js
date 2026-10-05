import { createClient } from '@supabase/supabase-js'

// Salin URL dari dashboard Supabase Anda (Gambar 1)
const supabaseUrl = 'https://lvbfgepuvrudlhbxgfry.supabase.co'

// Salin Anon Key dari Supabase: Project Settings -> API
const supabaseAnonKey = 'sb_publishable_tyW-tr5PiKsnZUzvvb3jtQ_EWnwdR_U' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)