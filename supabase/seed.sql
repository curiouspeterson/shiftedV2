-- Seed data for profiles
INSERT INTO public.profiles (id, full_name, email, role, status)
VALUES
  ('d0d54d58-7951-4de1-8827-7f6e7c162b0f', 'Adam Peterson', 'adam@example.com', 'manager', 'active'),
  ('e9d54d58-7951-4de1-8827-7f6e7c162b0f', 'John Doe', 'john@example.com', 'employee', 'active'),
  ('f8d54d58-7951-4de1-8827-7f6e7c162b0f', 'Jane Smith', 'jane@example.com', 'employee', 'active');

-- Seed data for shifts
INSERT INTO public.shifts (id, name, description, start_time, end_time)
VALUES
  (uuid_generate_v4(), 'Morning Shift', 'Early morning shift', '06:00:00', '14:00:00'),
  (uuid_generate_v4(), 'Afternoon Shift', 'Afternoon to evening shift', '14:00:00', '22:00:00'),
  (uuid_generate_v4(), 'Night Shift', 'Overnight shift', '22:00:00', '06:00:00');

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