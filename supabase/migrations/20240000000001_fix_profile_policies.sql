-- Drop existing policies if they exist
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;

-- Create new, more specific policies
create policy "Allow users to view their own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Allow managers to view all profiles"
    on profiles for select
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'manager'
        )
    );

create policy "Allow users to insert their own profile"
    on profiles for insert
    with check (auth.uid() = id);

create policy "Allow managers to insert profiles"
    on profiles for insert
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'manager'
        )
    );

create policy "Allow users to update their own profile"
    on profiles for update
    using (auth.uid() = id);

create policy "Allow managers to update all profiles"
    on profiles for update
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'manager'
        )
    ); 