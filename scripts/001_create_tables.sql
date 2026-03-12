-- Profiles table for user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  role text default 'member' check (role in ('member', 'moderator', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- News/Novidades table
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  excerpt text,
  image_url text,
  category text default 'general',
  is_featured boolean default false,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.news enable row level security;

create policy "news_select_all" on public.news for select using (true);
create policy "news_insert_admin" on public.news for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);
create policy "news_update_admin" on public.news for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);

-- Community posts table
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  channel text default 'general' check (channel in ('general', 'builds', 'help', 'showcase', 'off-topic')),
  is_flagged boolean default false,
  flag_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.community_posts enable row level security;

create policy "posts_select_all" on public.community_posts for select using (true);
create policy "posts_insert_auth" on public.community_posts for insert with check (auth.uid() = author_id);
create policy "posts_update_own" on public.community_posts for update using (auth.uid() = author_id);
create policy "posts_delete_own" on public.community_posts for delete using (auth.uid() = author_id);

-- Post likes table
create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "likes_select_all" on public.post_likes for select using (true);
create policy "likes_insert_auth" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.post_likes for delete using (auth.uid() = user_id);

-- Post comments table
create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_flagged boolean default false,
  created_at timestamptz default now()
);

alter table public.post_comments enable row level security;

create policy "comments_select_all" on public.post_comments for select using (true);
create policy "comments_insert_auth" on public.post_comments for insert with check (auth.uid() = author_id);
create policy "comments_delete_own" on public.post_comments for delete using (auth.uid() = author_id);

-- Chat messages table
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  author_id uuid not null references public.profiles(id) on delete cascade,
  room text default 'general' check (room in ('general', 'mission-control', 'builds', 'random')),
  is_flagged boolean default false,
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;

create policy "chat_select_all" on public.chat_messages for select using (true);
create policy "chat_insert_auth" on public.chat_messages for insert with check (auth.uid() = author_id);
create policy "chat_delete_own" on public.chat_messages for delete using (auth.uid() = author_id);

-- Moderation logs table
create table if not exists public.moderation_logs (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('post', 'comment', 'chat')),
  content_id uuid not null,
  original_content text not null,
  reason text not null,
  action text not null check (action in ('flagged', 'removed', 'warned')),
  created_at timestamptz default now()
);

alter table public.moderation_logs enable row level security;

create policy "mod_logs_select_admin" on public.moderation_logs for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'moderator'))
);
create policy "mod_logs_insert_all" on public.moderation_logs for insert with check (true);

-- Profile trigger for auto-creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Insert sample news
insert into public.news (title, content, excerpt, category, is_featured) values
('Lançamento do Falcon Heavy v2', 'O novo Falcon Heavy v2 foi lançado com sucesso ontem às 14:30 UTC. O foguete carregava um satélite de comunicação de última geração e dois boosters laterais retornaram para pouso vertical na base de lançamento.', 'Missão histórica marca novo capítulo na exploração espacial', 'launches', true),
('Tutorial: Construindo seu primeiro flight computer', 'Aprenda a construir um flight computer completo usando Arduino e sensores IMU. Este guia passo a passo vai te ensinar os fundamentos da aviónica de foguetes.', 'Guia completo para iniciantes em aviónica', 'tutorials', false),
('Novo sistema de telemetria LoRa disponível', 'Apresentamos nosso novo módulo de telemetria baseado em LoRa com alcance de até 50km. Ideal para foguetes de alta altitude e missões experimentais.', 'Alcance estendido para suas missões', 'technology', true),
('Comunidade atinge 10.000 membros!', 'Estamos muito felizes em anunciar que nossa comunidade Galaxy.SpaceCrafts chegou à marca de 10.000 membros ativos! Obrigado a todos pelo apoio e participação.', 'Marco histórico para nossa comunidade', 'community', false)
on conflict do nothing;
