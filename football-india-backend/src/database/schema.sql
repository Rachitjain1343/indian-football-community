create extension if not exists "pgcrypto";

create table if not exists public.fan_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  full_name text not null,
  username text unique,
  bio text,
  avatar_url text,
  city text,
  state text,
  favorite_club_id text,
  favorite_national_team_id text,
  favorite_clubs text[] not null default '{}',
  favorite_players text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_fan_profiles_user_id
  on public.fan_profiles (user_id);

create index if not exists idx_fan_profiles_username
  on public.fan_profiles (username);

create or replace function public.set_fan_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_fan_profiles_updated_at on public.fan_profiles;

create trigger trg_fan_profiles_updated_at
before update on public.fan_profiles
for each row
execute function public.set_fan_profiles_updated_at();
