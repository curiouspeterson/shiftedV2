-- Drop ALL existing RLS policies for profiles
do $$ 
declare 
    pol record;
begin
    for pol in select policyname 
               from pg_policies 
               where tablename = 'profiles' 
               and schemaname = 'public'
    loop
        execute format('drop policy if exists %I on public.profiles', pol.policyname);
    end loop;
end $$;

-- Create new RLS policies for profiles with improved access control
create policy "Managers can view all profiles" on public.profiles
    for select
    to authenticated
    using (
        auth.jwt()->>'role' = 'manager'
    );

create policy "Users can view own profile" on public.profiles
    for select
    to authenticated
    using (
        auth.uid() = id
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