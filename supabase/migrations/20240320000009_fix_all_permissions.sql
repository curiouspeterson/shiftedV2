-- Fix all schema permissions
SET ROLE postgres;

-- Grant permissions on public schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- Grant permissions on auth schema
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA auth TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres, service_role;

-- Grant limited permissions to authenticated users on auth schema
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO authenticated;

-- Grant limited permissions to anon users on auth schema
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO anon;

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

-- Grant execute on trigger function
GRANT EXECUTE ON FUNCTION public.handle_new_user TO service_role;

-- Reset role
RESET ROLE; 