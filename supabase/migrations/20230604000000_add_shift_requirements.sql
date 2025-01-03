-- Create the shift_requirements table
CREATE TABLE public.shift_requirements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  required_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add RLS policies for shift_requirements
ALTER TABLE public.shift_requirements ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view shift requirements
CREATE POLICY "Users can view shift requirements"
  ON public.shift_requirements FOR SELECT
  TO authenticated;

-- Only managers can manage shift requirements
CREATE POLICY "Managers can manage shift requirements"
  ON public.shift_requirements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'manager'
    )
  );

-- Add shift_requirement_id to employee_schedules
ALTER TABLE public.employee_schedules 
ADD COLUMN shift_requirement_id UUID REFERENCES public.shift_requirements(id);

-- Create trigger for updated_at
CREATE TRIGGER update_shift_requirements_updated_at
  BEFORE UPDATE ON public.shift_requirements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Fix employee_availability foreign key
ALTER TABLE public.employee_availability
DROP CONSTRAINT employee_availability_user_id_fkey,
ADD CONSTRAINT employee_availability_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE; 