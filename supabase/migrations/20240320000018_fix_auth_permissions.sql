-- Fix auth schema permissions without recreation
SET ROLE postgres;

-- Set search path
SELECT set_config('search_path', 'public, auth, extensions', false);

-- Grant schema usage
GRANT USAGE ON SCHEMA auth TO service_role;

-- Grant table permissions
GRANT ALL ON auth.users TO service_role;

-- Grant sequence permissions
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO service_role;

-- Grant function permissions
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON FUNCTIONS TO service_role;

-- Grant table permissions with default privileges
GRANT ALL ON ALL TABLES IN SCHEMA auth TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO service_role;

-- Ensure RLS is enabled on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing service role policy if it exists
DROP POLICY IF EXISTS "Service role has full access" ON auth.users;

-- Create RLS policy for service role
CREATE POLICY "Service role has full access" ON auth.users
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Reset role
RESET ROLE; 