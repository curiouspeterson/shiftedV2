-- Fix auth schema permissions
SET ROLE postgres;

-- Grant schema usage
GRANT USAGE ON SCHEMA auth TO service_role;

-- Grant table permissions
GRANT ALL ON ALL TABLES IN SCHEMA auth TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO service_role;

-- Grant sequence permissions
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO service_role;

-- Grant function permissions
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON FUNCTIONS TO service_role;

-- Grant procedure permissions
GRANT ALL ON ALL PROCEDURES IN SCHEMA auth TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON PROCEDURES TO service_role;

-- Ensure RLS is enabled on auth.users
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

-- Reset role
RESET ROLE; 