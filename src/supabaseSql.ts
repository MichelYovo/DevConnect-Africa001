export const SUPABASE_SQL_CODE = `-- ==========================================
-- DEVCONNECT AFRICA - SUPABASE DATABASE SCHEMA
-- Target Database: PostgreSQL / Supabase
-- Target Framework: Next.js 15 / React 19
-- Priority Focus: Togo Tech Community
-- ==========================================

-- 1. Create Profiles Table (Linked with Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  avatar text,
  title text not null,
  bio text,
  skills text[] default '{}'::text[],
  location text not null default 'Lomé', -- Suggestion: Lomé, Kara, Sokodé, Atakpamé, Kpalimé
  country text not null default 'Togo',
  github text,
  linkedin text,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  tech_stack text[] default '{}'::text[] not null,
  github_url text,
  demo_url text,
  author_id uuid references public.profiles(id) on delete cascade not null,
  author_name text not null,
  author_avatar text,
  likes integer default 0 not null,
  liked_by uuid[] default '{}'::uuid[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Events Table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  date timestamp with time zone not null,
  location text not null, -- Suggestion: Lomé, Kara, Sokodé, etc.
  venue text not null,
  organizer text not null,
  organizer_id uuid references public.profiles(id) on delete set null,
  attendees uuid[] default '{}'::uuid[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row-Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.events enable row level security;

-- 5. Row-Level Security (RLS) Policies

-- --- Profiles Policies ---
create policy "Allow public read access to profiles" 
  on public.profiles for select 
  using (true);

create policy "Allow authenticated users to update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Allow system/auth to insert user profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- --- Projects Policies ---
create policy "Allow public read access to projects" 
  on public.projects for select 
  using (true);

create policy "Allow authenticated users to insert projects" 
  on public.projects for insert 
  with check (auth.uid() = author_id);

create policy "Allow authenticated users to update their own projects" 
  on public.projects for update 
  using (auth.uid() = author_id);

create policy "Allow authenticated users to delete their own projects" 
  on public.projects for delete 
  using (auth.uid() = author_id);

-- --- Events Policies ---
create policy "Allow public read access to events" 
  on public.events for select 
  using (true);

create policy "Allow authenticated users to create events" 
  on public.events for insert 
  with check (true);

create policy "Allow authenticated users to join/leave events (update attendees)" 
  on public.events for update 
  using (true);

-- 6. Trigger to automatically create a profile record when a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, title, location, country, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'Software Engineer',
    'Lomé',
    'Togo',
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Seed Togolese Demonstration Data
-- Note: Replace with real client uuids or insert manually for demo users.
`;
