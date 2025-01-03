export interface Availability {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
  created_at: string
}

export interface Employee {
  id: string
  full_name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
  availability: Availability[]
}

export interface EmployeeFormData {
  full_name: string
  email: string
  role: string
  availability: {
    day_of_week: number
    start_time: string
    end_time: string
  }[]
} 