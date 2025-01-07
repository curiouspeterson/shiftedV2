export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'employee' | 'manager'
          weekly_hour_limit: number
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          role?: 'employee' | 'manager'
          weekly_hour_limit?: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'employee' | 'manager'
          weekly_hour_limit?: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
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