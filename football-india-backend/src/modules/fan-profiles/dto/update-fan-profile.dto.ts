export class UpdateFanProfileDto {
  fullName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  city?: string;
  state?: string;
  favoriteClubId?: string;
  favoriteNationalTeamId?: string;
  favoriteClubs?: string[];
  favoritePlayers?: string[];
}
