/**
 * Schedule Type Definitions
 * 
 * This file defines the core TypeScript interfaces for the scheduling system.
 * It provides type definitions for shift requirements, shift assignments, and
 * weekly schedules that are used throughout the application to manage and
 * display employee work schedules.
 */

/**
 * ShiftRequirement interface
 * Defines the template/pattern for recurring shift needs
 * 
 * @property id - Unique identifier for the shift requirement
 * @property name - Display name/description of the shift (e.g. "Morning Shift")
 * @property day_of_week - Day of week this shift occurs (0-6, Sunday-Saturday)
 * @property start_time - When the shift begins (24h format)
 * @property end_time - When the shift ends (24h format)
 * @property required_count - Number of employees needed for this shift
 */
export interface ShiftRequirement {
  id: string
  name: string
  day_of_week: number
  start_time: string
  end_time: string
  required_count: number
}

/**
 * ShiftAssignment interface
 * Represents a specific instance of a shift assigned to an employee
 * 
 * @property id - Unique identifier for the assignment
 * @property date - Calendar date of the shift
 * @property shift_requirement_id - References the template this shift is based on
 * @property profile_id - ID of the employee assigned to this shift
 * @property employee_name - Optional display name of the assigned employee
 * @property start_time - Actual start time for this specific shift
 * @property end_time - Actual end time for this specific shift
 * @property created_at - Timestamp of when the assignment was created
 * @property updated_at - Timestamp of last modification
 */
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

/**
 * WeeklySchedule interface
 * Maps calendar dates to arrays of shift assignments
 * Used to organize and display the complete schedule for a week
 * 
 * The date string key format should be ISO 8601 (YYYY-MM-DD)
 */
export interface WeeklySchedule {
  [date: string]: ShiftAssignment[]
} 