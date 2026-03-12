import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xazikmfsmtfvoofjqexd.supabase.co';
const supabaseAnonKey = 'sb_publishable_wpjRajbddnh-kipFiEFg3w_lVfeLQIc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
