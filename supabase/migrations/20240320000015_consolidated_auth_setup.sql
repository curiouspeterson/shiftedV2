-- Consolidated auth schema setup and permissions
SET ROLE postgres;

-- Set search path
ALTER DATABASE postgres SET search_path TO public, auth, extensions;
SELECT set_config('search_path', 'public, auth, extensions', false);

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop and recreate auth schema
DROP SCHEMA IF EXISTS auth CASCADE;
CREATE SCHEMA auth;

-- Create auth.users table
CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    aud character varying(255),
    role character varying(255),
    email character varying(255) UNIQUE,
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb DEFAULT '{}'::jsonb,
    raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone character varying(255) UNIQUE,
    phone_confirmed_at timestamp with time zone,
    phone_change character varying(255),
    phone_change_token character varying(255),
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone,
    email_change_token_current character varying(255),
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255),
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT users_email_change_confirm_status_check CHECK ((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2))
);

-- Create necessary indexes
CREATE INDEX users_instance_id_email_idx ON auth.users (instance_id, email);
CREATE INDEX users_instance_id_idx ON auth.users (instance_id);

-- Create auth functions
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
    SELECT 
        COALESCE(
            current_setting('request.jwt.claim.sub', true),
            (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
        )::uuid
$$;

CREATE OR REPLACE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
    SELECT 
        COALESCE(
            current_setting('request.jwt.claim.role', true),
            (current_setting('request.jwt.claims', true)::jsonb ->> 'role')
        )::text
$$;

CREATE OR REPLACE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
    SELECT 
        COALESCE(
            current_setting('request.jwt.claim.email', true),
            (current_setting('request.jwt.claims', true)::jsonb ->> 'email')
        )::text
$$;

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