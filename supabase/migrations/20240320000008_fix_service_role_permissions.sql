-- Fix service role permissions
SET ROLE postgres;

-- Grant permissions to service_role
GRANT ALL PRIVILEGES ON SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA auth TO service_role;

-- Explicitly grant permissions on auth.users
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO service_role;
GRANT ALL PRIVILEGES ON auth.users TO service_role;

-- Ensure service_role can bypass RLS
ALTER TABLE auth.users FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role has full access" ON auth.users;
CREATE POLICY "Service role has full access" ON auth.users
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Grant permissions to supabase_auth_admin
GRANT ALL PRIVILEGES ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO supabase_auth_admin;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA auth TO supabase_auth_admin;

-- Reset role
RESET ROLE; 