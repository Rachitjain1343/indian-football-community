import { Module } from '@nestjs/common';
import {
  createSupabaseAdminClient,
  SUPABASE_ADMIN_CLIENT,
} from '../../database/supabase.client';
import { FanProfilesController } from './fan-profiles.controller';
import { FanProfilesService } from './fan-profiles.service';

@Module({
  controllers: [FanProfilesController],
  providers: [
    FanProfilesService,
    {
      provide: SUPABASE_ADMIN_CLIENT,
      useFactory: createSupabaseAdminClient,
    },
  ],
})
export class FanProfilesModule {}
