/**
 * Supabase Database Type Definitions
 * 
 * This file defines the TypeScript types that map to our Supabase database schema.
 * It provides type safety and documentation for database operations throughout the application.
 * The types cover tables for user profiles, employee availability, shift requirements,
 * and shift assignments - forming the core data model for the scheduling system.
 */

export type Database = {
  public: {
    Tables: {
      /**
       * User Profiles Table
       * Stores core user information and authentication details
       * 
       * Contains user identity, role assignment, and account status
       * Used for user management and access control
       */
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'employee' | 'manager'
          position: 'Dispatcher' | 'Shift Supervisor' | 'Management'
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
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      /**
       * Employee Availability Table
       * Tracks when employees are available to work
       * 
       * Records recurring weekly availability patterns
       * Used for scheduling and shift assignment logic
       */
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

      /**
       * Shift Requirements Table
       * Defines the required shifts that need to be filled
       * 
       * Specifies recurring shift patterns and staffing needs
       * Used to determine scheduling requirements and generate shift assignments
       */
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

      /**
       * Shift Assignments Table
       * Records actual shift assignments for employees
       * 
       * Links employees to specific shifts on specific dates
       * Represents the final schedule after matching availability with requirements
       */
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

      /**
       * Shifts Table
       * Records actual shifts for employees
       * 
       * Tracks individual shift assignments, status, and details
       */
      shifts: {
        Row: {
          id: string
          profile_id: string
          user_email: string
          shift_requirement_id: string | null
          date: string
          start_time: string
          end_time: string
          status: 'pending' | 'accepted' | 'rejected' | 'completed'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          user_email: string
          shift_requirement_id?: string | null
          date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          user_email?: string
          shift_requirement_id?: string | null
          date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'completed'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      /**
       * Time Off Requests Table
       * Manages employee time off requests
       * 
       * Tracks vacation, sick leave, and other time off requests
       */
      time_off_requests: {
        Row: {
          id: string
          profile_id: string
          start_date: string
          end_date: string
          reason: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          start_date: string
          end_date: string
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          start_date?: string
          end_date?: string
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      position_type: 'Dispatcher' | 'Shift Supervisor' | 'Management'
    }
  }
} 