import { createClient } from '@supabase/supabase-js'

// Salin URL dari dashboard Supabase Anda (Gambar 1)
const supabaseUrl = 'https://lvbfgepuvrudlhbxgfry.supabase.co'

// Salin Anon Key dari Supabase: Project Settings -> API
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YmZnZXB1dnJ1ZGxoYnhnZnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NzA1ODQsImV4cCI6MjEwNjU0NjU4NH0.YfNyUqlz8PuCQixLtwUN1kDADUNSk4yjw3MqiuSQ3UE' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
