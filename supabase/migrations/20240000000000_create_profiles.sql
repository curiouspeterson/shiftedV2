-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade,
    full_name text,
    email text,
    role text check (role in ('employee', 'manager')) default 'employee',
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
);

-- Enable RLS
alter table profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using ( true );

create policy "Users can insert their own profile"
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update own profile"
    on profiles for update
    using ( auth.uid() = id );

-- Handle updated_at
create trigger handle_updated_at before update on profiles 
    for each row execute procedure moddatetime (updated_at); 