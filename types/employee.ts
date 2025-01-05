/**
 * Employee Type Definitions
 * 
 * This file defines the core TypeScript interfaces for employee data management.
 * It provides type definitions for employee availability, employee profiles,
 * and form data structures used throughout the application for managing
 * employee information and scheduling.
 */

/**
 * Availability interface
 * Defines an employee's recurring availability pattern for scheduling
 * 
 * @property id - Unique identifier for the availability record
 * @property profile_id - References the employee profile this availability belongs to
 * @property day_of_week - Day this availability applies to (0-6, Sunday-Saturday)
 * @property start_time - When the employee can start work (24h format)
 * @property end_time - When the employee must end work (24h format)
 * @property created_at - Timestamp of when the availability was created
 */
export interface Availability {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
  created_at: string
}

/**
 * Employee interface
 * Represents a complete employee profile with all associated data
 * 
 * @property id - Unique identifier for the employee
 * @property full_name - Employee's full name
 * @property email - Employee's contact email
 * @property role - Access level and job role (employee or manager)
 * @property is_active - Whether the employee account is currently active
 * @property created_at - Optional timestamp of profile creation
 * @property updated_at - Optional timestamp of last profile update
 * @property availability - Optional array of employee's availability patterns
 */
export interface Employee {
  id: string
  full_name: string | null
  email: string | null
  role: 'employee' | 'manager'
  is_active: boolean
  created_at?: string
  updated_at?: string
  availability?: Availability[]
}

/**
 * EmployeeFormData interface
 * Defines the structure of data used in employee creation/edit forms
 * Simplified version of Employee interface with only editable fields
 * 
 * @property full_name - Employee's full name input
 * @property email - Employee's email input
 * @property role - Selected role for the employee
 * @property availability - Array of availability schedule inputs
 */
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