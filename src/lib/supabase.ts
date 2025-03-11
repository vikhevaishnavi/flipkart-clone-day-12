import { createClient } from '@supabase/supabase-js';

// Provide default values for development to prevent runtime errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key-for-development';

export const supabase = createClient(supabaseUrl, supabaseKey);