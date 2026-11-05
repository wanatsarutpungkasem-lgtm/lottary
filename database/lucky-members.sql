
create table public.lucky_member_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check(char_length(display_name)<=40),
 zodiac text not null default 'none' check(zodiac in ('none','aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces')),
 created_at timestamptz not null default now()
);
create table public.lucky_member_draws (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 number text not null check(number ~ '^([0-9]{2}|[0-9]{3}|[0-9]{6})$'),
 player_name text not null check(char_length(player_name) between 1 and 40),
 zodiac text not null default 'none' check(zodiac in ('none','aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces')),
 created_at timestamptz not null default now()
);
create index lucky_member_draws_owner_time on public.lucky_member_draws(user_id,created_at desc);
create table public.lucky_member_keeps (
 user_id uuid not null references auth.users(id) on delete cascade,
 leaf_id smallint not null check(leaf_id between 1 and 28),
 created_at timestamptz not null default now(),
 primary key(user_id,leaf_id)
);
alter table public.lucky_member_profiles enable row level security;
alter table public.lucky_member_draws enable row level security;
alter table public.lucky_member_keeps enable row level security;
revoke all on public.lucky_member_profiles,public.lucky_member_draws,public.lucky_member_keeps from public,anon,authenticated;
grant select,insert,update,delete on public.lucky_member_profiles to authenticated;
grant select,insert,delete on public.lucky_member_draws to authenticated;
grant select,insert,delete on public.lucky_member_keeps to authenticated;
create policy lucky_profiles_owner on public.lucky_member_profiles for all to authenticated using ((select auth.uid())=user_id and not coalesce((select auth.jwt())->>'is_anonymous','false')::boolean) with check ((select auth.uid())=user_id and not coalesce((select auth.jwt())->>'is_anonymous','false')::boolean);
create policy lucky_draws_read on public.lucky_member_draws for select to authenticated using ((select auth.uid())=user_id and not coalesce((select auth.jwt())->>'is_anonymous','false')::boolean);
create policy lucky_draws_add on public.lucky_member_draws for insert to authenticated with check ((select auth.uid())=user_id and not coalesce((select auth.jwt())->>'is_anonymous','false')::boolean);
create policy lucky_draws_remove on public.lucky_member_draws for delete to authenticated using ((select auth.uid())=user_id);
create policy lucky_keeps_owner on public.lucky_member_keeps for all to authenticated using ((select auth.uid())=user_id and not coalesce((select auth.jwt())->>'is_anonymous','false')::boolean) with check ((select auth.uid())=user_id and not coalesce((select auth.jwt())->>'is_anonymous','false')::boolean);

