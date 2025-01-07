-- Drop ALL existing RLS policies for profiles to ensure clean slate
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
    for select using (
        auth.jwt()->>'role' = 'manager'
    );

create policy "Users can view own profile" on public.profiles
    for select using (
        auth.uid() = id
    );

create policy "Users can update own profile" on public.profiles
    for update using (
        auth.uid() = id
    );

create policy "Managers can update all profiles" on public.profiles
    for update using (
        auth.jwt()->>'role' = 'manager'
    );

create policy "Managers can delete profiles" on public.profiles
    for delete using (
        auth.jwt()->>'role' = 'manager'
    );

create policy "System can create profiles" on public.profiles
    for insert with check (true);

-- Add comment explaining the policies
comment on table public.profiles is 'User profiles with role-based access control:
- Managers can view and manage all profiles
- Regular users can only view and update their own profile
- System can create new profiles during user registration'; 