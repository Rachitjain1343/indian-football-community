import { SupabaseClient } from '@supabase/supabase-js';
import { CreateFanProfileDto } from './dto/create-fan-profile.dto';
import { UpdateFanProfileDto } from './dto/update-fan-profile.dto';
export declare class FanProfilesService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(createFanProfileDto: CreateFanProfileDto): Promise<any>;
    update(id: string, updateFanProfileDto: UpdateFanProfileDto): Promise<any>;
}
