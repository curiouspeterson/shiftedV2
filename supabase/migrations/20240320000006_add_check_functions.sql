-- Add helper functions for checking database setup
SET ROLE postgres;

-- Function to check auth schema setup
CREATE OR REPLACE FUNCTION public.check_auth_setup(schema_name text, table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'schema_exists', EXISTS (
            SELECT FROM pg_namespace WHERE nspname = schema_name
        ),
        'table_exists', EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = schema_name 
            AND tablename = table_name
        ),
        'has_rls', EXISTS (
            SELECT FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = schema_name
            AND c.relname = table_name
            AND c.relrowsecurity = true
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Function to check service role permissions
CREATE OR REPLACE FUNCTION public.check_service_role_permissions()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'has_auth_usage', EXISTS (
            SELECT FROM pg_namespace n
            JOIN pg_policy p ON p.polnamespace = n.oid
            WHERE n.nspname = 'auth'
        ),
        'has_profiles_access', EXISTS (
            SELECT FROM pg_tables
            WHERE schemaname = 'public'
            AND tablename = 'profiles'
        ),
        'service_role_exists', EXISTS (
            SELECT FROM pg_roles
            WHERE rolname = 'service_role'
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.check_auth_setup TO service_role;
GRANT EXECUTE ON FUNCTION public.check_service_role_permissions TO service_role;

-- Reset role
RESET ROLE; 