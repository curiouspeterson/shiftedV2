/**
 * Client-side Authentication Utility Module
 * 
 * This module provides client-side authentication functionality using Supabase,
 * including user sign-in, sign-up, and sign-out capabilities.
 */

import { createClient } from '@/lib/supabase/client'

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
  role: 'employee' | 'manager' = 'employee',
  position: 'Dispatcher' | 'Shift Supervisor' | 'Management' = 'Dispatcher'
) {
  const supabase = createClient()
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        position
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