-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.check_service_role_permissions();

-- Create schema check function
CREATE OR REPLACE FUNCTION public.check_service_role_permissions()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
    auth_schema_exists boolean;
    auth_users_exists boolean;
BEGIN
    -- Check if auth schema exists
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.schemata 
        WHERE schema_name = 'auth'
    ) INTO auth_schema_exists;

    -- Check if auth.users table exists
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'auth' 
        AND table_name = 'users'
    ) INTO auth_users_exists;

    -- Build result object
    result = jsonb_build_object(
        'auth_schema_exists', auth_schema_exists,
        'auth_users_exists', auth_users_exists,
        'current_user', current_user,
        'current_role', current_role,
        'search_path', current_setting('search_path')
    );

    -- Only check table permissions if the schema and table exist
    IF auth_schema_exists AND auth_users_exists THEN
        result = result || jsonb_build_object(
            'can_create_users', has_table_privilege(current_user, 'auth.users', 'INSERT'),
            'can_read_users', has_table_privilege(current_user, 'auth.users', 'SELECT'),
            'can_update_users', has_table_privilege(current_user, 'auth.users', 'UPDATE'),
            'can_delete_users', has_table_privilege(current_user, 'auth.users', 'DELETE')
        );
    END IF;

    -- Check profiles table permissions
    result = result || jsonb_build_object(
        'can_create_profiles', has_table_privilege(current_user, 'public.profiles', 'INSERT'),
        'can_read_profiles', has_table_privilege(current_user, 'public.profiles', 'SELECT'),
        'can_update_profiles', has_table_privilege(current_user, 'public.profiles', 'UPDATE'),
        'can_delete_profiles', has_table_privilege(current_user, 'public.profiles', 'DELETE')
    );

    -- Add schema information
    result = result || jsonb_build_object(
        'schemas', (
            SELECT jsonb_agg(schema_name)
            FROM information_schema.schemata
            WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        )
    );

    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.check_service_role_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_service_role_permissions() TO service_role; 