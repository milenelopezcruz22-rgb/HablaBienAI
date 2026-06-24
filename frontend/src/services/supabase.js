import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkoativnrsmqhrbcdvkh.supabase.co';
const supabaseAnonKey = 'sb_publishable_AIf-ojwCKsCWQXlgZXw1Tg_TSP4yrIS';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);