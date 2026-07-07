import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_PUBLIC_CLIENT = 'SUPABASE_PUBLIC_CLIENT';
export const SUPABASE_ADMIN_CLIENT = 'SUPABASE_ADMIN_CLIENT';

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function createSupabasePublicClient(): SupabaseClient {
  return createClient(
    getRequiredEnv('SUPABASE_URL'),
    getRequiredEnv('SUPABASE_ANON_KEY'),
  );
}

export function createSupabaseAdminClient(): SupabaseClient {
  return createClient(
    getRequiredEnv('SUPABASE_URL'),
    getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
