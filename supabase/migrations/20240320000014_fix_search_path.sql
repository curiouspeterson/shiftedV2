-- Fix search path and permissions
SET ROLE postgres;

-- Set search path
ALTER DATABASE postgres SET search_path TO public, auth, extensions;
SELECT set_config('search_path', 'public, auth, extensions', false);

-- Grant schema usage
GRANT USAGE ON SCHEMA auth TO postgres, service_role, authenticated, anon;

-- Grant table permissions
GRANT ALL ON auth.users TO postgres, service_role;
GRANT SELECT ON auth.users TO authenticated, anon;

-- Grant sequence permissions
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO authenticated, anon;

-- Grant function permissions
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated, anon;

-- Ensure RLS is enabled
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own user data" ON auth.users;
DROP POLICY IF EXISTS "Service role has full access" ON auth.users;

-- Create new policies
CREATE POLICY "Users can view their own user data" ON auth.users
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Service role has full access" ON auth.users
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Grant execute on specific functions
GRANT EXECUTE ON FUNCTION auth.uid() TO service_role, authenticated, anon;
GRANT EXECUTE ON FUNCTION auth.role() TO service_role, authenticated, anon;
GRANT EXECUTE ON FUNCTION auth.email() TO service_role, authenticated, anon;

-- Reset role
RESET ROLE; 