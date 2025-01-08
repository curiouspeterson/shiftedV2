-- Fix auth schema owner and permissions
SET ROLE postgres;

-- Grant necessary permissions
GRANT ALL ON SCHEMA auth TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA auth TO service_role;

-- Ensure RLS is enabled and policies are correct
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
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

-- Grant execute on auth functions
GRANT EXECUTE ON FUNCTION auth.uid() TO service_role;
GRANT EXECUTE ON FUNCTION auth.role() TO service_role;
GRANT EXECUTE ON FUNCTION auth.email() TO service_role;

-- Reset role
RESET ROLE; 