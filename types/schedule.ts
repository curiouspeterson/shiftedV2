export interface ShiftRequirement {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  required_count: number
}

export interface ShiftAssignment {
  id: string
  date: string
  shift_requirement_id: string
  profile_id: string
  employee_name?: string
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
}

export interface WeeklySchedule {
  [date: string]: ShiftAssignment[]
} 