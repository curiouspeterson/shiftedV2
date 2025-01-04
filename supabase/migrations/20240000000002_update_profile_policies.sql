-- Drop existing policies
drop policy if exists "Allow users to view their own profile" on profiles;
drop policy if exists "Allow managers to view all profiles" on profiles;
drop policy if exists "Allow users to insert their own profile" on profiles;
drop policy if exists "Allow managers to insert profiles" on profiles;
drop policy if exists "Allow users to update their own profile" on profiles;
drop policy if exists "Allow managers to update all profiles" on profiles;

-- Create simpler policies for now (we can make them more restrictive later)
create policy "Enable read access to all users"
    on profiles for select
    using (true);

create policy "Enable insert access to all users"
    on profiles for insert
    with check (true);

create policy "Enable update access to all users"
    on profiles for update
    using (true); 