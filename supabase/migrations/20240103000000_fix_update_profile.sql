-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.update_profile_raw;

-- Create the function with proper parameters and return type
CREATE OR REPLACE FUNCTION public.update_profile_raw(
    p_id UUID,
    p_full_name TEXT,
    p_role TEXT,
    p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    updated_profile JSONB;
BEGIN
    -- Update the profile
    UPDATE public.profiles
    SET
        full_name = p_full_name,
        role = p_role,
        email = p_email,
        updated_at = NOW()
    WHERE id = p_id
    RETURNING to_jsonb(profiles.*) INTO updated_profile;

    -- Return the updated profile data
    RETURN updated_profile;
END;
$$; 