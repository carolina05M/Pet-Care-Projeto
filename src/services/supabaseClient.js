import { createClient } from '@supabase/supabase-js'

// Aqui ele pega os valores que você colocou no arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Aqui ele cria a conexão oficial
export const supabase = createClient(supabaseUrl, supabaseAnonKey)