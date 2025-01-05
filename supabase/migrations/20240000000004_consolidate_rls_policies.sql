-- Drop existing policies
do $$
begin
    -- Profiles
    drop policy if exists "Users can view their own profile" on profiles;
    drop policy if exists "Users can update their own profile" on profiles;
    drop policy if exists "Managers can view all profiles" on profiles;
    drop policy if exists "Managers can update all profiles" on profiles;
    drop policy if exists "Managers can delete profiles" on profiles;
    drop policy if exists "System can create profiles" on profiles;
    drop policy if exists "Allow users to view their own profile" on profiles;
    drop policy if exists "Allow managers to view all profiles" on profiles;
    drop policy if exists "Allow users to insert their own profile" on profiles;
    drop policy if exists "Allow managers to insert profiles" on profiles;
    drop policy if exists "Allow users to update their own profile" on profiles;
    drop policy if exists "Allow managers to update all profiles" on profiles;

    -- Employee Availability
    drop policy if exists "Users can view own availability" on employee_availability;
    drop policy if exists "Users can insert own availability" on employee_availability;
    drop policy if exists "Users can update own availability" on employee_availability;
    drop policy if exists "Users can delete own availability" on employee_availability;
    drop policy if exists "Managers can view all availability" on employee_availability;

    -- Shift Requirements
    drop policy if exists "Anyone can view shift requirements" on shift_requirements;
    drop policy if exists "Managers can manage shift requirements" on shift_requirements;

    -- Shift Assignments
    drop policy if exists "Users can view own assignments" on shift_assignments;
    drop policy if exists "Users can update own assignments" on shift_assignments;
    drop policy if exists "Managers can insert assignments" on shift_assignments;
    drop policy if exists "Managers can delete assignments" on shift_assignments;
end$$;

-- Create helper function to check if user is manager
create or replace function public.is_manager()
returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1 from profiles
        where id = auth.uid()
        and role = 'manager'
        and is_active = true
    );
$$;

-- Create helper function to check if user owns record
create or replace function public.owns_record(record_profile_id uuid)
returns boolean
language sql
security definer
stable
as $$
    select exists (
        select 1 from profiles
        where id = auth.uid()
        and id = record_profile_id
        and is_active = true
    );
$$;

-- Profiles policies
create policy "profiles_select"
    on profiles for select
    using (
        -- Users can view their own profile
        auth.uid() = id
        -- Managers can view all profiles
        or is_manager()
    );

create policy "profiles_insert"
    on profiles for insert
    with check (
        -- Users can only insert their own profile
        auth.uid() = id
        -- Managers can insert any profile
        or is_manager()
    );

create policy "profiles_update"
    on profiles for update
    using (
        -- Users can update their own profile
        auth.uid() = id
        -- Managers can update any profile
        or is_manager()
    );

create policy "profiles_delete"
    on profiles for delete
    using (
        -- Only managers can delete profiles
        is_manager()
    );

-- Employee Availability policies
create policy "employee_availability_select"
    on employee_availability for select
    using (
        -- Users can view their own availability
        owns_record(profile_id)
        -- Managers can view all availability
        or is_manager()
    );

create policy "employee_availability_insert"
    on employee_availability for insert
    with check (
        -- Users can insert their own availability
        owns_record(profile_id)
        -- Managers can insert for anyone
        or is_manager()
    );

create policy "employee_availability_update"
    on employee_availability for update
    using (
        -- Users can update their own availability
        owns_record(profile_id)
        -- Managers can update anyone's availability
        or is_manager()
    );

create policy "employee_availability_delete"
    on employee_availability for delete
    using (
        -- Users can delete their own availability
        owns_record(profile_id)
        -- Managers can delete anyone's availability
        or is_manager()
    );

-- Shift Requirements policies
create policy "shift_requirements_select"
    on shift_requirements for select
    using (
        -- Authenticated users can view shift requirements
        auth.role() = 'authenticated'
    );

create policy "shift_requirements_all"
    on shift_requirements for all
    using (
        -- Only managers can manage shift requirements
        is_manager()
    );

-- Shift Assignments policies
create policy "shift_assignments_select"
    on shift_assignments for select
    using (
        -- Users can view their own assignments
        owns_record(profile_id)
        -- Managers can view all assignments
        or is_manager()
    );

create policy "shift_assignments_insert"
    on shift_assignments for insert
    with check (
        -- Only managers can create assignments
        is_manager()
    );

create policy "shift_assignments_update"
    on shift_assignments for update
    using (
        -- Users can update their own assignments
        owns_record(profile_id)
        -- Managers can update any assignment
        or is_manager()
    );

create policy "shift_assignments_delete"
    on shift_assignments for delete
    using (
        -- Only managers can delete assignments
        is_manager()
    ); 