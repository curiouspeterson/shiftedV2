export interface Availability {
  id: string
  employee_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export interface Employee {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
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