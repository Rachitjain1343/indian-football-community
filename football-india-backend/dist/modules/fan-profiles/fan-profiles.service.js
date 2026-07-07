"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanProfilesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_client_1 = require("../../database/supabase.client");
let FanProfilesService = class FanProfilesService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async findAll() {
        const { data, error } = await this.supabase
            .from('fan_profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data;
    }
    async findOne(id) {
        const { data, error } = await this.supabase
            .from('fan_profiles')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!data) {
            throw new common_1.NotFoundException(`Fan profile ${id} not found`);
        }
        return data;
    }
    async create(createFanProfileDto) {
        const payload = {
            user_id: createFanProfileDto.userId,
            full_name: createFanProfileDto.fullName,
            username: createFanProfileDto.username ?? null,
            bio: createFanProfileDto.bio ?? null,
            avatar_url: createFanProfileDto.avatarUrl ?? null,
            city: createFanProfileDto.city ?? null,
            state: createFanProfileDto.state ?? null,
            favorite_club_id: createFanProfileDto.favoriteClubId ?? null,
            favorite_national_team_id: createFanProfileDto.favoriteNationalTeamId ?? null,
            favorite_clubs: createFanProfileDto.favoriteClubs ?? [],
            favorite_players: createFanProfileDto.favoritePlayers ?? [],
        };
        const { data, error } = await this.supabase
            .from('fan_profiles')
            .insert(payload)
            .select('*')
            .single();
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data;
    }
    async update(id, updateFanProfileDto) {
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
                favorite_national_team_id: updateFanProfileDto.favoriteNationalTeamId,
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
            throw new common_1.InternalServerErrorException(error.message);
        }
        if (!data) {
            throw new common_1.NotFoundException(`Fan profile ${id} not found`);
        }
        return data;
    }
};
exports.FanProfilesService = FanProfilesService;
exports.FanProfilesService = FanProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(supabase_client_1.SUPABASE_ADMIN_CLIENT)),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], FanProfilesService);
//# sourceMappingURL=fan-profiles.service.js.map