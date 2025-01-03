export interface ShiftRequirement {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  required_count: number
}

export interface ShiftAssignment {
  id: string
  employee_id: string
  shift_requirement_id: string
  date: string
}

export interface ScheduleDay {
  date: string
  shifts: {
    requirement: ShiftRequirement
    assignments: {
      id: string
      employee: {
        id: string
        full_name: string
      }
    }[]
  }[]
}

export interface WeeklySchedule {
  startDate: string
  endDate: string
  days: ScheduleDay[]
} 