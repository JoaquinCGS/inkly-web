import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Cliente de Supabase para operaciones del servidor
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
  console.warn('⚠️ Supabase no está configurado aún. Las órdenes no se guardarán en BD hasta definir SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');
}
