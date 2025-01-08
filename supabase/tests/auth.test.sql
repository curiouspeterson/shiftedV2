BEGIN;

-- Load pgTAP
SELECT plan(6);

-- Test user signup
SELECT has_table('auth', 'users', 'Should have users table in auth schema');
SELECT has_column('auth', 'users', 'email', 'Should have email column in users table');
SELECT has_column('auth', 'users', 'encrypted_password', 'Should have encrypted_password column in users table');

-- Test user profile creation trigger
SELECT has_table('public', 'profiles', 'Should have profiles table in public schema');
SELECT has_column('public', 'profiles', 'id', 'Should have id column in profiles table');
SELECT has_column('public', 'profiles', 'email', 'Should have email column in profiles table');

-- Finish the tests and clean up
SELECT * FROM finish();
ROLLBACK; 