-- Enable the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create auth.users entries first
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES
  ('d0d54d58-7951-4de1-8827-7f6e7c162b0f', 'adam@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(), 
   jsonb_build_object('full_name', 'Adam Peterson', 'role', 'manager', 'weekly_hour_limit', 40)),
  ('e9d54d58-7951-4de1-8827-7f6e7c162b0f', 'john@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(),
   jsonb_build_object('full_name', 'John Doe', 'role', 'employee', 'weekly_hour_limit', 40)),
  ('f8d54d58-7951-4de1-8827-7f6e7c162b0f', 'jane@example.com', crypt('password123', gen_salt('bf')), now(), now(), now(),
   jsonb_build_object('full_name', 'Jane Smith', 'role', 'employee', 'weekly_hour_limit', 40));

-- Seed data for employee_availability
INSERT INTO public.employee_availability (profile_id, day_of_week, start_time, end_time)
VALUES
  ('e9d54d58-7951-4de1-8827-7f6e7c162b0f', 0, '09:00:00', '17:00:00'),
  ('e9d54d58-7951-4de1-8827-7f6e7c162b0f', 1, '09:00:00', '17:00:00'),
  ('e9d54d58-7951-4de1-8827-7f6e7c162b0f', 2, '09:00:00', '17:00:00'),
  ('e9d54d58-7951-4de1-8827-7f6e7c162b0f', 3, '09:00:00', '17:00:00'),
  ('e9d54d58-7951-4de1-8827-7f6e7c162b0f', 4, '09:00:00', '17:00:00'),
  ('f8d54d58-7951-4de1-8827-7f6e7c162b0f', 1, '13:00:00', '21:00:00'),
  ('f8d54d58-7951-4de1-8827-7f6e7c162b0f', 2, '13:00:00', '21:00:00'),
  ('f8d54d58-7951-4de1-8827-7f6e7c162b0f', 3, '13:00:00', '21:00:00'),
  ('f8d54d58-7951-4de1-8827-7f6e7c162b0f', 4, '13:00:00', '21:00:00'),
  ('f8d54d58-7951-4de1-8827-7f6e7c162b0f', 5, '13:00:00', '21:00:00');

-- Seed data for shift_requirements
INSERT INTO public.shift_requirements (name, day_of_week, start_time, end_time, required_count)
VALUES
  ('Morning Shift', 0, '09:00:00', '17:00:00', 2),
  ('Morning Shift', 1, '09:00:00', '17:00:00', 2),
  ('Morning Shift', 2, '09:00:00', '17:00:00', 2),
  ('Morning Shift', 3, '09:00:00', '17:00:00', 2),
  ('Morning Shift', 4, '09:00:00', '17:00:00', 2),
  ('Morning Shift', 5, '09:00:00', '17:00:00', 1),
  ('Morning Shift', 6, '09:00:00', '17:00:00', 1),
  ('Evening Shift', 1, '13:00:00', '21:00:00', 2),
  ('Evening Shift', 2, '13:00:00', '21:00:00', 2),
  ('Evening Shift', 3, '13:00:00', '21:00:00', 2),
  ('Evening Shift', 4, '13:00:00', '21:00:00', 2),
  ('Evening Shift', 5, '13:00:00', '21:00:00', 1),
  ('Evening Shift', 6, '13:00:00', '21:00:00', 1);

-- Seed data for system_status
INSERT INTO public.system_status (component, status, message)
VALUES
  ('Authentication', 'operational', 'User authentication system is working normally'),
  ('Database', 'operational', 'Database connections and queries are functioning properly'),
  ('API', 'operational', 'API endpoints are responding as expected'); 