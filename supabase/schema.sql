-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES table (auto-created on signup via trigger)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default now()
);

-- EVENTS table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  location text not null,
  event_date timestamp with time zone not null,
  available_seats integer not null check (available_seats >= 0),
  total_seats integer not null,
  image_url text,
  price numeric(10, 2) default 0.00,
  created_at timestamp with time zone default now()
);

-- BOOKINGS table
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  event_id uuid references public.events(id) on delete cascade not null,
  booked_at timestamp with time zone default now(),
  status text default 'confirmed' check (status in ('confirmed', 'cancelled')),
  unique(user_id, event_id)
);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.bookings enable row level security;

-- Policies: profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Policies: events (public read)
create policy "Anyone can view events" on public.events
  for select using (true);

-- Policies: bookings
create policy "Users can view their own bookings" on public.bookings
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookings" on public.bookings
  for insert with check (auth.uid() = user_id);

-- Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed sample events
insert into public.events (title, description, location, event_date, available_seats, total_seats, image_url, price) values
  ('Tech Summit 2025', 'Annual technology conference featuring AI, Web3, and Cloud Computing talks.', 'Mumbai Convention Centre', '2025-09-15 09:00:00+05:30', 200, 200, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 999.00),
  ('Design Systems Workshop', 'Hands-on workshop covering Figma, tokens, and component architecture.', 'Bangalore Tech Park', '2025-10-02 10:00:00+05:30', 50, 50, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 499.00),
  ('Startup Pitch Night', 'Watch 20 startups pitch to top VCs. Networking dinner included.', 'Delhi ITC Maurya', '2025-11-20 18:00:00+05:30', 100, 100, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 299.00);
