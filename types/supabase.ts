export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'employee' | 'manager'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'employee' | 'manager'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'employee' | 'manager'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      employee_availability: {
        Row: {
          id: string
          profile_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          created_at?: string
        }
      }
      shift_requirements: {
        Row: {
          id: string
          name: string
          day_of_week: number
          start_time: string
          end_time: string
          required_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          day_of_week: number
          start_time: string
          end_time: string
          required_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          required_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      shift_assignments: {
        Row: {
          id: string
          profile_id: string
          shift_requirement_id: string
          date: string
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          shift_requirement_id: string
          date: string
          start_time: string
          end_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          shift_requirement_id?: string
          date?: string
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 