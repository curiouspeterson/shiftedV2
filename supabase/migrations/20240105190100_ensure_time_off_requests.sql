-- Drop existing function if it exists
drop function if exists public.update_profile_raw(uuid, text, text, text);

-- Create or replace the function with new return type
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
    -- Update the profile
    update public.profiles
    set
        full_name = p_full_name,
        role = p_role,
        email = p_email,
        updated_at = now()
    where id = p_id
    returning to_jsonb(profiles.*) into updated_profile;

    -- Return the updated profile data
    return updated_profile;
end;
$$;

-- Drop and recreate time_off_requests table
drop table if exists public.time_off_requests cascade;

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

-- Enable RLS on time_off_requests table
alter table public.time_off_requests enable row level security;

-- RLS policies for time_off_requests
create policy "Users can view own time off requests" on public.time_off_requests for select using (auth.uid() = profile_id);
create policy "Users can insert own time off requests" on public.time_off_requests for insert with check (auth.uid() = profile_id);
create policy "Users can update own time off requests" on public.time_off_requests for update using (auth.uid() = profile_id);
create policy "Users can delete own time off requests" on public.time_off_requests for delete using (auth.uid() = profile_id);
create policy "Managers can view all time off requests" on public.time_off_requests for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));
create policy "Managers can manage all time off requests" on public.time_off_requests for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'manager'));

-- Create trigger for updated_at
create trigger update_time_off_requests_updated_at 
    before update on public.time_off_requests 
    for each row 
    execute function public.update_updated_at(); 