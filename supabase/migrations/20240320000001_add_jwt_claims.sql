-- Create a function to sync user role with JWT claims
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

-- Create a trigger to sync role changes
drop trigger if exists on_profile_role_change on public.profiles;
create trigger on_profile_role_change
    after insert or update of role on public.profiles
    for each row
    execute function public.sync_user_role();

-- Update existing users
update auth.users u
set raw_user_meta_data = 
    coalesce(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', p.role)
from public.profiles p
where u.id = p.id; 