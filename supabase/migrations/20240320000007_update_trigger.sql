-- Update the handle_new_user trigger function
SET ROLE postgres;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user TO service_role;

-- Reset role
RESET ROLE; 