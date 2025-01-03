-- Create auth.users entries first
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('d0d54d58-7951-4de1-8827-7f6e7c162b0f', 'adam@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('e9d54d58-7951-4de1-8827-7f6e7c162b0f', 'john@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('f8d54d58-7951-4de1-8827-7f6e7c162b0f', 'jane@example.com', crypt('password123', gen_salt('bf')), now(), now(), now());

-- Seed data for profiles
INSERT INTO public.profiles (id, full_name, email, role, status)
VALUES
  ('d0d54d58-7951-4de1-8827-7f6e7c162b0f', 'Adam Peterson', 'adam@example.com', 'manager', 'active'),
  ('e9d54d58-7951-4de1-8827-7f6e7c162b0f', 'John Doe', 'john@example.com', 'employee', 'active'),
  ('f8d54d58-7951-4de1-8827-7f6e7c162b0f', 'Jane Smith', 'jane@example.com', 'employee', 'active');

-- Seed data for employee_availability
INSERT INTO public.employee_availability (user_id, day_of_week, start_time, end_time)
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
INSERT INTO public.shift_requirements (day_of_week, start_time, end_time, required_count)
VALUES
  (0, '09:00:00', '17:00:00', 2),
  (1, '09:00:00', '17:00:00', 2),
  (2, '09:00:00', '17:00:00', 2),
  (3, '09:00:00', '17:00:00', 2),
  (4, '09:00:00', '17:00:00', 2),
  (5, '09:00:00', '17:00:00', 1),
  (6, '09:00:00', '17:00:00', 1),
  (1, '13:00:00', '21:00:00', 2),
  (2, '13:00:00', '21:00:00', 2),
  (3, '13:00:00', '21:00:00', 2),
  (4, '13:00:00', '21:00:00', 2),
  (5, '13:00:00', '21:00:00', 1),
  (6, '13:00:00', '21:00:00', 1);

-- Seed data for system_status
INSERT INTO public.system_status (component, status, description)
VALUES
  ('Authentication', 'operational', 'User authentication system is working normally'),
  ('Database', 'operational', 'Database connections and queries are functioning properly'),
  ('API', 'operational', 'API endpoints are responding as expected');

-- Seed data for development_progress
INSERT INTO public.development_progress (task_title, description, status, priority, due_date)
VALUES
  ('Implement User Authentication', 'Set up authentication system with Supabase', 'completed', 'high', '2024-01-01'),
  ('Create Employee Management', 'Build employee management interface', 'in_progress', 'high', '2024-01-15'),
  ('Develop Shift Scheduling', 'Implement shift scheduling system', 'not_started', 'medium', '2024-02-01'); 