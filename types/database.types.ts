export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'employee' | 'manager'
          position: 'Dispatcher' | 'Shift Supervisor' | 'Management'
          weekly_hour_limit: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'employee' | 'manager'
          position?: 'Dispatcher' | 'Shift Supervisor' | 'Management'
          weekly_hour_limit?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'employee' | 'manager'
          position?: 'Dispatcher' | 'Shift Supervisor' | 'Management'
          weekly_hour_limit?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // ... other tables
    }
    // ... other schema components
  }
} 