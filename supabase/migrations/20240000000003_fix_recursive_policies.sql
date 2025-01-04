-- First, drop all existing policies
drop policy if exists "Enable read access to all users" on profiles;
drop policy if exists "Enable insert access to all users" on profiles;
drop policy if exists "Enable update access to all users" on profiles;

-- Then create new, non-recursive policies
create policy "Allow authenticated read access"
    on profiles for select
    using (auth.role() = 'authenticated');

create policy "Allow authenticated insert"
    on profiles for insert
    with check (auth.role() = 'authenticated');

create policy "Allow authenticated update"
    on profiles for update
    using (auth.role() = 'authenticated'); 