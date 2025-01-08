-- Set up auth permissions correctly
SET ROLE postgres;

-- Ensure search path includes auth schema
SELECT set_config('search_path', 'public, auth, extensions', false);

-- Grant necessary permissions to service_role
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA auth TO service_role;

-- Explicitly grant permissions on auth.users
ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO service_role;
GRANT ALL PRIVILEGES ON auth.users TO service_role;

-- Grant limited permissions to authenticated users
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticated;

-- Grant limited permissions to anon users
GRANT USAGE ON SCHEMA auth TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon;

-- Create auth helper functions if they don't exist
CREATE OR REPLACE FUNCTION auth.uid() 
RETURNS uuid 
LANGUAGE sql STABLE
AS $$
  SELECT 
    COALESCE(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

-- Create RLS policies for auth.users
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'auth'
        AND tablename = 'users'
    ) THEN
        -- Enable RLS
        ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can view their own user data" ON auth.users;
        
        -- Create new policy
        CREATE POLICY "Users can view their own user data" ON auth.users
            FOR SELECT TO authenticated
            USING (auth.uid() = id);
            
        -- Allow service_role to bypass RLS
        ALTER TABLE auth.users FORCE ROW LEVEL SECURITY;
        CREATE POLICY "Service role has full access" ON auth.users
            FOR ALL TO service_role
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Reset role
RESET ROLE; 