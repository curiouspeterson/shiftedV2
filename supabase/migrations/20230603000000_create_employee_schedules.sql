-- Create the employee_schedules table
CREATE TABLE public.employee_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.employee_schedules ENABLE ROW LEVEL SECURITY;

-- Employees can view their own schedules
CREATE POLICY "Employees can view their own schedules"
  ON public.employee_schedules FOR SELECT
  USING (auth.uid() = user_id);

-- Only managers can insert, update, and delete schedules
CREATE POLICY "Managers can manage schedules"
  ON public.employee_schedules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Create an update_updated_at function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_employee_schedules_updated_at
BEFORE UPDATE ON public.employee_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

