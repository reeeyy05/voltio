import { createClient } from '@supabase/supabase-js';

// Buscamos las llaves
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Creamos la conexión y la exportamos para usarla en toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);