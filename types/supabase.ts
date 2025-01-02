export type Database = {
  public: {
    Tables: {
      employee_schedules: {
        Row: {
          id: string
          employee_id: string
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          start_time?: string
          end_time?: string
          created_at?: string
        }
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 