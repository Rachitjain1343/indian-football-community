import { SupabaseClient } from '@supabase/supabase-js';
export declare const SUPABASE_PUBLIC_CLIENT = "SUPABASE_PUBLIC_CLIENT";
export declare const SUPABASE_ADMIN_CLIENT = "SUPABASE_ADMIN_CLIENT";
export declare function createSupabasePublicClient(): SupabaseClient;
export declare function createSupabaseAdminClient(): SupabaseClient;
