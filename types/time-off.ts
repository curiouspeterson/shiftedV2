/**
 * Time Off Request Type Definitions
 * 
 * This file defines the TypeScript types related to employee time off requests.
 * It provides type safety and documentation for the time off request data structure
 * used throughout the application for managing employee leave and absences.
 */

/**
 * TimeOffRequest type
 * Represents a single time off request from an employee
 * 
 * @property id - Unique identifier for the time off request
 * @property user_id - ID of the user/employee making the request
 * @property start_date - Start date of the requested time off period (ISO string format)
 * @property end_date - End date of the requested time off period (ISO string format)
 * @property reason - Optional explanation for the time off request
 * @property status - Current state of the request: pending, approved, or rejected
 * @property created_at - Timestamp of when the request was created (ISO string)
 * @property updated_at - Timestamp of the last update to the request (ISO string)
 */
export type TimeOffRequest = {
  id: string
  user_id: string
  start_date: string
  end_date: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}