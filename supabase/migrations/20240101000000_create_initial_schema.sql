-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    email text unique,
    role text check (role in ('employee', 'manager')) not null default 'employee',
    weekly_hour_limit integer not null default 40,
    is_active boolean not null default true,
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Create employee_availability table
create table if not exists public.employee_availability (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles(id) on delete cascade,
    day_of_week integer not null check (day_of_week between 0 and 6),
    start_time time not null,
    end_time time not null,
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    unique(profile_id, day_of_week)
);

-- Create shift_requirements table
create table if not exists public.shift_requirements (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    day_of_week integer not null check (day_of_week between 0 and 6),
    start_time time not null,
    end_time time not null,
    required_count integer not null default 1,
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Create shift_assignments table
create table if not exists public.shift_assignments (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles(id) on delete cascade,
    shift_requirement_id uuid not null references public.shift_requirements(id) on delete cascade,
    date date not null,
    start_time time not null,
    end_time time not null,
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone('utc'::text, now()),
    constraint unique_shift_assignment unique(profile_id, shift_requirement_id, date)
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.employee_availability enable row level security;
alter table public.shift_requirements enable row level security;
alter table public.shift_assignments enable row level security;

-- RLS policies for profiles
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Managers can view all profiles" on public.profiles for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can update all profiles" on public.profiles for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "System can create profiles" on public.profiles for insert with check (true);

-- RLS policies for employee_availability
create policy "Users can view own availability" on public.employee_availability for select using (auth.uid() = profile_id);
create policy "Users can insert own availability" on public.employee_availability for insert with check (auth.uid() = profile_id);
create policy "Users can update own availability" on public.employee_availability for update using (auth.uid() = profile_id);
create policy "Users can delete own availability" on public.employee_availability for delete using (auth.uid() = profile_id);
create policy "Managers can view all availability" on public.employee_availability for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));

-- RLS policies for shift requirements
create policy "Anyone can view shift requirements" on public.shift_requirements for select to authenticated using (true);
create policy "Managers can manage shift requirements" on public.shift_requirements for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));

-- RLS policies for shift_assignments
create policy "Users can view own assignments" on public.shift_assignments for select using (auth.uid() = profile_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "Users can update own assignments" on public.shift_assignments for update using (auth.uid() = profile_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can insert assignments" on public.shift_assignments for insert with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can delete assignments" on public.shift_assignments for delete using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, full_name, email, role, weekly_hour_limit, is_active)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        coalesce(new.raw_user_meta_data->>'role', 'employee'),
        coalesce((new.raw_user_meta_data->>'weekly_hour_limit')::integer, 40),
        true
    );
    return new;
end;
$$;

-- Create trigger for new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Create triggers to update updated_at timestamp on modification
create trigger update_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at();
create trigger update_shift_requirements_updated_at before update on public.shift_requirements for each row execute function public.update_updated_at();
create trigger update_shift_assignments_updated_at before update on public.shift_assignments for each row execute function public.update_updated_at();