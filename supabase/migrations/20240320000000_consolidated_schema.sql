-- Drop existing tables if they exist
drop table if exists public.time_off_requests cascade;
drop table if exists public.shifts cascade;
drop table if exists public.shift_assignments cascade;
drop table if exists public.shift_requirements cascade;
drop table if exists public.employee_availability cascade;
drop table if exists public.profiles cascade;

-- Drop existing types
drop type if exists public.position_type cascade;

-- Create position type enum
create type public.position_type as enum ('Dispatcher', 'Shift Supervisor', 'Management');

-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    email text unique,
    role text check (role in ('employee', 'manager')) not null default 'employee',
    position position_type not null default 'Dispatcher'::position_type,
    weekly_hour_limit integer not null default 40 check (weekly_hour_limit >= 0 AND weekly_hour_limit <= 168),
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

-- Create shift_assignments table
create table if not exists public.shift_assignments (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid not null references public.profiles(id) on delete cascade,
    shift_requirement_id uuid not null references public.shift_requirements(id),
    date date not null,
    start_time time not null,
    end_time time not null,
    created_at timestamp with time zone not null default timezone('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone('utc'::text, now()),
    constraint unique_shift_assignment unique(profile_id, shift_requirement_id, date)
);

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (
        id,
        full_name,
        email,
        role,
        position,
        weekly_hour_limit,
        is_active,
        updated_at
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email,
        coalesce(new.raw_user_meta_data->>'role', 'employee')::text,
        coalesce(new.raw_user_meta_data->>'position', 'Dispatcher')::position_type,
        coalesce((new.raw_user_meta_data->>'weekly_hour_limit')::int, 40),
        true,
        now()
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

-- Create function to sync user role with JWT claims
create or replace function public.sync_user_role()
returns trigger
language plpgsql
security definer
as $$
begin
    -- Update auth.users with the role from profiles
    update auth.users
    set raw_user_meta_data = 
        coalesce(raw_user_meta_data, '{}'::jsonb) || 
        jsonb_build_object('role', new.role)
    where id = new.id;
    
    return new;
end;
$$;

-- Create function to update profile
create or replace function public.update_profile_raw(
  p_id uuid,
  p_full_name text,
  p_role text,
  p_email text,
  p_position position_type
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
        position = p_position,
        updated_at = now()
    where id = p_id
    returning to_jsonb(profiles.*) into updated_profile;
    return updated_profile;
end;
$$;

-- Drop existing triggers first
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_profile_role_change on public.profiles;

-- Create triggers
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

create trigger on_profile_role_change
    after insert or update of role on public.profiles
    for each row
    execute function public.sync_user_role();

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

create trigger update_shift_assignments_updated_at 
    before update on public.shift_assignments 
    for each row execute function public.update_updated_at();

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.employee_availability enable row level security;
alter table public.shift_requirements enable row level security;
alter table public.shifts enable row level security;
alter table public.time_off_requests enable row level security;
alter table public.shift_assignments enable row level security;

-- RLS policies for profiles
create policy "Users can view own profile" on public.profiles
    for select
    to authenticated
    using (
        auth.uid() = id
    );

create policy "Managers can view all profiles" on public.profiles
    for select
    to authenticated
    using (
        auth.jwt()->>'role' = 'manager'
    );

create policy "Users can update own profile" on public.profiles
    for update
    to authenticated
    using (
        auth.uid() = id
    );

create policy "Managers can update all profiles" on public.profiles
    for update
    to authenticated
    using (
        auth.jwt()->>'role' = 'manager'
    );

create policy "Managers can delete profiles" on public.profiles
    for delete
    to authenticated
    using (
        auth.jwt()->>'role' = 'manager'
    );

create policy "System can create profiles" on public.profiles
    for insert
    to authenticated
    with check (true);

-- RLS policies for employee_availability
create policy "Users can view own availability" on public.employee_availability 
    for select using (auth.uid() = profile_id);
create policy "Users can insert own availability" on public.employee_availability 
    for insert with check (auth.uid() = profile_id);
create policy "Users can update own availability" on public.employee_availability 
    for update using (auth.uid() = profile_id);
create policy "Users can delete own availability" on public.employee_availability 
    for delete using (auth.uid() = profile_id);
create policy "Managers can view all availability" on public.employee_availability 
    for select using (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- RLS policies for shift_requirements
create policy "Anyone can view shift requirements" on public.shift_requirements 
    for select to authenticated using (true);
create policy "Managers can manage shift requirements" on public.shift_requirements 
    for all using (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- RLS policies for shifts
create policy "Users can view own shifts" on public.shifts 
    for select using (auth.uid() = profile_id);

create policy "Users can update own shifts" on public.shifts 
    for update using (auth.uid() = profile_id);

create policy "Users can insert own shifts" on public.shifts 
    for insert with check (auth.uid() = profile_id);

create policy "Managers can view all shifts" on public.shifts 
    for select using (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

create policy "Managers can manage all shifts" on public.shifts 
    for all using (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- RLS policies for time_off_requests
create policy "Users can view own time off requests" on public.time_off_requests 
    for select using (auth.uid() = profile_id);
create policy "Users can insert own time off requests" on public.time_off_requests 
    for insert with check (auth.uid() = profile_id);
create policy "Users can update own time off requests" on public.time_off_requests 
    for update using (auth.uid() = profile_id);
create policy "Users can delete own time off requests" on public.time_off_requests 
    for delete using (auth.uid() = profile_id);
create policy "Managers can view all time off requests" on public.time_off_requests 
    for select using (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
    );
create policy "Managers can manage all time off requests" on public.time_off_requests 
    for all using (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

-- RLS policies for shift_assignments
create policy "Users can view own assignments" on public.shift_assignments 
    for select using (auth.uid() = profile_id);

create policy "Users can update own assignments" on public.shift_assignments 
    for update using (auth.uid() = profile_id);

create policy "Managers can insert assignments" on public.shift_assignments 
    for insert with check (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

create policy "Managers can delete assignments" on public.shift_assignments 
    for delete using (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'manager'
        )
    );

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

-- Grant permissions for all tables
grant all privileges on all tables in schema public to authenticated;
grant all privileges on all tables in schema public to service_role;

-- Grant usage on sequences
grant usage on all sequences in schema public to authenticated;
grant usage on all sequences in schema public to service_role;

-- Temporarily disable RLS for initial data insertion
alter table public.profiles disable row level security;
alter table public.employee_availability disable row level security;
alter table public.shifts disable row level security;
alter table public.shift_assignments disable row level security;
alter table public.time_off_requests disable row level security;

-- Insert profiles for any auth users that don't have them
INSERT INTO public.profiles (id, full_name, email, role, position, is_active)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
    au.email,
    COALESCE(au.raw_user_meta_data->>'role', 'employee'),
    COALESCE((au.raw_user_meta_data->>'position')::position_type, 'Dispatcher'),
    true
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Create test data for the first profile
DO $$ 
DECLARE
    test_profile_id uuid;
BEGIN
    -- Get the first available profile ID
    SELECT id INTO test_profile_id FROM public.profiles LIMIT 1;

    IF test_profile_id IS NOT NULL THEN
        -- Insert test shift assignments
        INSERT INTO public.shift_assignments (profile_id, shift_requirement_id, date, start_time, end_time)
        SELECT 
            test_profile_id,
            sr.id,
            CURRENT_DATE + i,
            sr.start_time,
            sr.end_time
        FROM public.shift_requirements sr
        CROSS JOIN generate_series(0, 6) i
        LIMIT 5;

        -- Insert test shifts
        INSERT INTO public.shifts (profile_id, user_email, shift_requirement_id, date, start_time, end_time, status)
        SELECT 
            test_profile_id,
            (SELECT email FROM public.profiles WHERE id = test_profile_id),
            sr.id,
            CURRENT_DATE + i,
            sr.start_time,
            sr.end_time,
            'pending'
        FROM public.shift_requirements sr
        CROSS JOIN generate_series(0, 6) i
        LIMIT 5;

        -- Insert test availability
        INSERT INTO public.employee_availability (profile_id, day_of_week, start_time, end_time)
        SELECT 
            test_profile_id,
            day_of_week,
            '09:00'::time,
            '17:00'::time
        FROM generate_series(0, 6) AS day_of_week
        ON CONFLICT (profile_id, day_of_week) DO NOTHING;

        -- Insert test time off requests
        INSERT INTO public.time_off_requests (profile_id, start_date, end_date, reason, status)
        VALUES 
            (test_profile_id, CURRENT_DATE + 7, CURRENT_DATE + 8, 'Vacation', 'pending');
    END IF;
END $$;

-- Re-enable RLS
alter table public.profiles enable row level security;
alter table public.employee_availability enable row level security;
alter table public.shifts enable row level security;
alter table public.shift_assignments enable row level security;
alter table public.time_off_requests enable row level security; 