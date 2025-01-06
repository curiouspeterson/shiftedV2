-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    email text unique,
    role text check (role in ('employee', 'manager')) not null default 'employee',
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

-- Create shifts table
create table if not exists public.shifts (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles(id) on delete cascade,
    user_email text not null,
    shift_requirement_id uuid references public.shift_requirements(id),
    date date not null,
    start_time time not null,
    end_time time not null,
    status text not null check (status in ('pending', 'accepted', 'rejected', 'completed')) default 'pending',
    notes text,
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Create time_off_requests table
create table if not exists public.time_off_requests (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles(id) on delete cascade,
    start_date date not null,
    end_date date not null,
    reason text,
    status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone('utc'::text, now()),
    constraint unique_time_off_request unique(profile_id, start_date, end_date)
);

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, full_name, email, role, is_active)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        coalesce(new.raw_user_meta_data->>'role', 'employee'),
        true
    );
    return new;
end;
$$;

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

-- Create function to update profile
create or replace function public.update_profile_raw(
  p_id uuid,
  p_full_name text,
  p_role text,
  p_email text
) returns jsonb
language plpgsql
security definer
as $$
declare
    updated_profile jsonb;
begin
    update public.profiles
    set
        full_name = p_full_name,
        role = p_role,
        email = p_email,
        updated_at = now()
    where id = p_id
    returning to_jsonb(profiles.*) into updated_profile;
    return updated_profile;
end;
$$;

-- Create triggers
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

create trigger update_profiles_updated_at 
    before update on public.profiles 
    for each row execute function public.update_updated_at();

create trigger update_shift_requirements_updated_at 
    before update on public.shift_requirements 
    for each row execute function public.update_updated_at();

create trigger update_shifts_updated_at 
    before update on public.shifts 
    for each row execute function public.update_updated_at();

create trigger update_time_off_requests_updated_at 
    before update on public.time_off_requests 
    for each row execute function public.update_updated_at();

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.employee_availability enable row level security;
alter table public.shift_requirements enable row level security;
alter table public.shifts enable row level security;
alter table public.time_off_requests enable row level security;

-- RLS policies for profiles
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Managers can view all profiles" on public.profiles for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can update all profiles" on public.profiles for update using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can delete profiles" on public.profiles for delete using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "System can create profiles" on public.profiles for insert with check (true);

-- RLS policies for employee_availability
create policy "Users can view own availability" on public.employee_availability for select using (auth.uid() = profile_id);
create policy "Users can insert own availability" on public.employee_availability for insert with check (auth.uid() = profile_id);
create policy "Users can update own availability" on public.employee_availability for update using (auth.uid() = profile_id);
create policy "Users can delete own availability" on public.employee_availability for delete using (auth.uid() = profile_id);
create policy "Managers can view all availability" on public.employee_availability for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));

-- RLS policies for shift_requirements
create policy "Anyone can view shift requirements" on public.shift_requirements for select to authenticated using (true);
create policy "Managers can manage shift requirements" on public.shift_requirements for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));

-- RLS policies for shifts
create policy "Users can view own shifts" on public.shifts 
    for select using (
        auth.uid() = profile_id or 
        user_email = (select email from public.profiles where id = auth.uid())
    );

create policy "Users can update own shifts" on public.shifts 
    for update using (
        auth.uid() = profile_id or 
        user_email = (select email from public.profiles where id = auth.uid())
    );

create policy "Users can insert own shifts" on public.shifts 
    for insert with check (
        auth.uid() = profile_id or 
        user_email = (select email from public.profiles where id = auth.uid())
    );

create policy "Managers can view all shifts" on public.shifts 
    for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));

create policy "Managers can manage all shifts" on public.shifts 
    for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));

-- RLS policies for time_off_requests
create policy "Users can view own time off requests" on public.time_off_requests for select using (auth.uid() = profile_id);
create policy "Users can insert own time off requests" on public.time_off_requests for insert with check (auth.uid() = profile_id);
create policy "Users can update own time off requests" on public.time_off_requests for update using (auth.uid() = profile_id);
create policy "Users can delete own time off requests" on public.time_off_requests for delete using (auth.uid() = profile_id);
create policy "Managers can view all time off requests" on public.time_off_requests for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can manage all time off requests" on public.time_off_requests for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));

-- Add indexes for better query performance
create index shifts_profile_id_idx on public.shifts(profile_id);
create index shifts_user_email_idx on public.shifts(user_email);
create index shifts_date_idx on public.shifts(date);
create index shifts_status_idx on public.shifts(status);
create index shifts_shift_requirement_id_idx on public.shifts(shift_requirement_id);

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all privileges on table public.shifts to authenticated;
grant all privileges on table public.shifts to service_role;

-- Insert default shift requirements
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift Early (4 hours)', day_of_week, '05:00', '09:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift Early (10 hours)', day_of_week, '05:00', '15:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift Early (12 hours)', day_of_week, '05:00', '17:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift (4 hours)', day_of_week, '09:00', '13:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift (10 hours)', day_of_week, '09:00', '19:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift (12 hours)', day_of_week, '09:00', '21:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Swing Shift (4 hours)', day_of_week, '13:00', '17:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Swing Shift (10 hours)', day_of_week, '15:00', '01:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Swing Shift (12 hours)', day_of_week, '15:00', '03:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Graveyards (4 hours)', day_of_week, '01:00', '05:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Graveyards (10 hours)', day_of_week, '19:00', '05:00', 1
FROM generate_series(0, 6) AS day_of_week;

INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Graveyards (12 hours)', day_of_week, '17:00', '05:00', 1
FROM generate_series(0, 6) AS day_of_week;