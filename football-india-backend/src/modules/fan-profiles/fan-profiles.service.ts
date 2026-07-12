import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ADMIN_CLIENT } from '../../database/supabase.client';
import { CreateFanProfileDto } from './dto/create-fan-profile.dto';
import { UpdateFanProfileDto } from './dto/update-fan-profile.dto';

@Injectable()
export class FanProfilesService {
  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async findAll() {
    const { data, error } = await this.supabase
      .from('fan_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('fan_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException(`Fan profile ${id} not found`);
    }

    return data;
  }

  async findByUserId(userId: string) {
    const { data, error } = await this.supabase.from('fan_profiles').select('*').eq('user_id', userId).maybeSingle();
    if (error) throw new InternalServerErrorException(error.message);
    if (!data) throw new NotFoundException('Fan profile not found');
    return data;
  }

  async create(createFanProfileDto: CreateFanProfileDto) {
    const payload = {
      user_id: createFanProfileDto.userId,
      full_name: createFanProfileDto.fullName,
      username: createFanProfileDto.username ?? null,
      bio: createFanProfileDto.bio ?? null,
      avatar_url: createFanProfileDto.avatarUrl ?? null,
      city: createFanProfileDto.city ?? null,
      state: createFanProfileDto.state ?? null,
      favorite_club_id: createFanProfileDto.favoriteClubId ?? null,
      favorite_national_team_id:
        createFanProfileDto.favoriteNationalTeamId ?? null,
      favorite_clubs: createFanProfileDto.favoriteClubs ?? [],
      favorite_players: createFanProfileDto.favoritePlayers ?? [],
    };

    const { data, error } = await this.supabase
      .from('fan_profiles')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async update(id: string, updateFanProfileDto: UpdateFanProfileDto) {
    const payload = {
      ...(updateFanProfileDto.fullName !== undefined && {
        full_name: updateFanProfileDto.fullName,
      }),
      ...(updateFanProfileDto.username !== undefined && {
        username: updateFanProfileDto.username,
      }),
      ...(updateFanProfileDto.bio !== undefined && {
        bio: updateFanProfileDto.bio,
      }),
      ...(updateFanProfileDto.avatarUrl !== undefined && {
        avatar_url: updateFanProfileDto.avatarUrl,
      }),
      ...(updateFanProfileDto.city !== undefined && {
        city: updateFanProfileDto.city,
      }),
      ...(updateFanProfileDto.state !== undefined && {
        state: updateFanProfileDto.state,
      }),
      ...(updateFanProfileDto.favoriteClubId !== undefined && {
        favorite_club_id: updateFanProfileDto.favoriteClubId,
      }),
      ...(updateFanProfileDto.favoriteNationalTeamId !== undefined && {
        favorite_national_team_id:
          updateFanProfileDto.favoriteNationalTeamId,
      }),
      ...(updateFanProfileDto.favoriteClubs !== undefined && {
        favorite_clubs: updateFanProfileDto.favoriteClubs,
      }),
      ...(updateFanProfileDto.favoritePlayers !== undefined && {
        favorite_players: updateFanProfileDto.favoritePlayers,
      }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('fan_profiles')
      .update(payload)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException(`Fan profile ${id} not found`);
    }

    return data;
  }

  async updateByUserId(userId: string, dto: UpdateFanProfileDto) { const profile = await this.findByUserId(userId); return this.update(profile.id, dto); }
}
