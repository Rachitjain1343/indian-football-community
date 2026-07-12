import { Inject, Injectable } from '@nestjs/common'; import { SupabaseClient } from '@supabase/supabase-js'; import { SUPABASE_ADMIN_CLIENT } from '../../database/supabase.client'; import { SupabaseCrudService } from '../../common/services/supabase-crud.service';
@Injectable() export class ClubsService extends SupabaseCrudService { constructor(@Inject(SUPABASE_ADMIN_CLIENT) db: SupabaseClient) { super(db, 'clubs'); } }

