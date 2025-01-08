/**
 * Client-side Authentication Utility Module
 * 
 * This module provides client-side authentication functionality using Supabase,
 * including user sign-in, sign-up, and sign-out capabilities.
 */

import { createClient } from '@/lib/supabase/client'

export type UserRole = 'Employee' | 'Manager' | 'Admin'
export type UserPosition = 'Dispatcher' | 'Shift Supervisor' | 'Management'

type RolePositionMap = {
  Employee: Array<Extract<UserPosition, 'Dispatcher' | 'Shift Supervisor'>>
  Manager: Array<Extract<UserPosition, 'Management'>>
  Admin: Array<Extract<UserPosition, 'Management'>>
}

const VALID_POSITIONS: RolePositionMap = {
  Employee: ['Dispatcher', 'Shift Supervisor'],
  Manager: ['Management'],
  Admin: ['Management']
}

/**
 * Validates if a position is valid for a given role
 */
function isValidPositionForRole(role: UserRole, position: UserPosition): boolean {
  return VALID_POSITIONS[role].includes(position as any)
}

/**
 * Gets the default position for a role
 */
function getDefaultPositionForRole(role: UserRole): UserPosition {
  return role === 'Employee' ? 'Dispatcher' : 'Management'
}

/**
 * Sign in a user with email and password.
 * 
 * @param email - User's email address.
 * @param password - User's password.
 * @returns Signed-in user data including session information.
 * @throws Error if sign-in fails with the specific error message from Supabase.
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/**
 * Sign up a new user with email and password.
 * 
 * @param email - User's email address.
 * @param password - User's password.
 * @param fullName - User's full name.
 * @param role - User's role.
 * @param position - User's position.
 * @returns Newly created user data including confirmation status.
 * @throws Error if sign-up fails with the specific error message from Supabase.
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: UserRole = 'Employee',
  position?: UserPosition
) {
  // If position is not provided or is invalid for the role, use the default
  const validPosition = position && isValidPositionForRole(role, position)
    ? position
    : getDefaultPositionForRole(role)

  const supabase = createClient()
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        position: validPosition
      }
    }
  })

  if (error) {
    throw error
  }

  return data
}

/**
 * Sign out the current user.
 * 
 * @throws Error if sign-out operation fails with the specific error message from Supabase.
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
} 