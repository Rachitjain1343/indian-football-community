import { Global, Module } from '@nestjs/common';
import { createSupabaseAdminClient, createSupabasePublicClient, SUPABASE_ADMIN_CLIENT, SUPABASE_PUBLIC_CLIENT } from './supabase.client';

@Global()
@Module({
  providers: [
    { provide: SUPABASE_ADMIN_CLIENT, useFactory: createSupabaseAdminClient },
    { provide: SUPABASE_PUBLIC_CLIENT, useFactory: createSupabasePublicClient },
  ],
  exports: [SUPABASE_ADMIN_CLIENT, SUPABASE_PUBLIC_CLIENT],
})
export class DatabaseModule {}
