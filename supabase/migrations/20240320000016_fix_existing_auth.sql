-- Fix permissions for existing auth schema
SET ROLE postgres;

-- Set search path
SELECT set_config('search_path', 'public, auth, extensions', false);

-- Ensure we have the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant schema usage
GRANT USAGE ON SCHEMA auth TO postgres, service_role, authenticated, anon;

-- Grant table permissions
GRANT ALL ON auth.users TO postgres, service_role;
GRANT SELECT ON auth.users TO authenticated, anon;

-- Grant sequence permissions
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO authenticated, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT USAGE ON SEQUENCES TO authenticated, anon;

-- Grant function permissions
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO postgres, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT EXECUTE ON FUNCTIONS TO authenticated, anon;

-- Grant table permissions with default privileges
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticated, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT SELECT ON TABLES TO authenticated, anon;

-- Enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own user data" ON auth.users;
DROP POLICY IF EXISTS "Service role has full access" ON auth.users;

-- Create RLS policies
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