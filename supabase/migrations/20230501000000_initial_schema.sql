-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('employee', 'manager')) NOT NULL DEFAULT 'employee',
  status TEXT CHECK (status IN ('active', 'inactive')) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add RLS policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Only managers can view all profiles
CREATE POLICY "Managers can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Only managers can update profiles
CREATE POLICY "Managers can update profiles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Create the shifts table
CREATE TABLE public.shifts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add RLS policies for shifts
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view shifts
CREATE POLICY "Users can view shifts"
  ON public.shifts FOR SELECT
  TO authenticated;

-- Only managers can manage shifts
CREATE POLICY "Managers can manage shifts"
  ON public.shifts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Create the shift_assignments table
CREATE TABLE public.shift_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shift_id UUID REFERENCES public.shifts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(shift_id, user_id)
);

-- Add RLS policies for shift_assignments
ALTER TABLE public.shift_assignments ENABLE ROW LEVEL SECURITY;

-- Users can view their own assignments
CREATE POLICY "Users can view own assignments"
  ON public.shift_assignments FOR SELECT
  USING (auth.uid() = user_id);

-- Managers can view all assignments
CREATE POLICY "Managers can view all assignments"
  ON public.shift_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Only managers can manage assignments
CREATE POLICY "Managers can manage assignments"
  ON public.shift_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Create the employee_availability table
CREATE TABLE public.employee_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, day_of_week)
);

-- Add RLS policies for employee_availability
ALTER TABLE public.employee_availability ENABLE ROW LEVEL SECURITY;

-- Users can view their own availability
CREATE POLICY "Users can view own availability"
  ON public.employee_availability FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own availability
CREATE POLICY "Users can manage own availability"
  ON public.employee_availability FOR ALL
  USING (auth.uid() = user_id);

-- Managers can view all availability
CREATE POLICY "Managers can view all availability"
  ON public.employee_availability FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Create the system_status table
CREATE TABLE public.system_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  component TEXT NOT NULL,
  status TEXT CHECK (status IN ('operational', 'degraded', 'down')) NOT NULL DEFAULT 'operational',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add RLS policies for system_status
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view system status
CREATE POLICY "Users can view system status"
  ON public.system_status FOR SELECT
  TO authenticated;

-- Only managers can manage system status
CREATE POLICY "Managers can manage system status"
  ON public.system_status FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Create the development_progress table
CREATE TABLE public.development_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) NOT NULL DEFAULT 'not_started',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add RLS policies for development_progress
ALTER TABLE public.development_progress ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view development progress
CREATE POLICY "Users can view development progress"
  ON public.development_progress FOR SELECT
  TO authenticated;

-- Only managers can manage development progress
CREATE POLICY "Managers can manage development progress"
  ON public.development_progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON public.shifts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_shift_assignments_updated_at
  BEFORE UPDATE ON public.shift_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_employee_availability_updated_at
  BEFORE UPDATE ON public.employee_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_system_status_updated_at
  BEFORE UPDATE ON public.system_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_development_progress_updated_at
  BEFORE UPDATE ON public.development_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at(); 