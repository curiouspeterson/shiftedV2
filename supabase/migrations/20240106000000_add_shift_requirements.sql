-- Clear existing shift requirements
DELETE FROM public.shift_requirements;

-- Enable error handling
DO $$ 
BEGIN

-- Insert Day Shift Early (4 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift Early (4 hours)', day_of_week, '05:00', '09:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Day Shift Early (10 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift Early (10 hours)', day_of_week, '05:00', '15:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Day Shift Early (12 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift Early (12 hours)', day_of_week, '05:00', '17:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Day Shift (4 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift (4 hours)', day_of_week, '09:00', '13:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Day Shift (10 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift (10 hours)', day_of_week, '09:00', '19:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Day Shift (12 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Day Shift (12 hours)', day_of_week, '09:00', '21:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Swing Shift (4 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Swing Shift (4 hours)', day_of_week, '13:00', '17:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Swing Shift (10 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Swing Shift (10 hours)', day_of_week, '15:00', '01:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Swing Shift (12 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Swing Shift (12 hours)', day_of_week, '15:00', '03:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Graveyards (4 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Graveyards (4 hours)', day_of_week, '01:00', '05:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Graveyards (10 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Graveyards (10 hours)', day_of_week, '19:00', '05:00', 1
FROM generate_series(0, 6) AS day_of_week;

-- Insert Graveyards (12 hours)
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
SELECT 'Graveyards (12 hours)', day_of_week, '17:00', '05:00', 1
FROM generate_series(0, 6) AS day_of_week;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error occurred: %', SQLERRM;
    RAISE;
END $$; 