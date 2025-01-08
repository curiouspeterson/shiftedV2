BEGIN;

-- Load pgTAP
SELECT plan(4);

-- Test profile table existence
SELECT ok(
    EXISTS(
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ),
    'Profiles table should exist'
);

-- Test profile table structure
SELECT ok(
    EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'id'
    ),
    'Profiles table should have id column'
);

SELECT ok(
    EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email'
    ),
    'Profiles table should have email column'
);

-- Test profile trigger
SELECT ok(
    EXISTS(
        SELECT 1 FROM information_schema.triggers 
        WHERE event_object_schema = 'public' 
        AND event_object_table = 'profiles'
    ),
    'Profiles table should have triggers'
);

-- Finish the tests and clean up
SELECT * FROM finish();
ROLLBACK; 