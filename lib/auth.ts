'use client'

import { createBrowserClient } from './supabase/client'

/**
 * Supabase Client Instance
 * 
 * Creates and exports a singleton instance of the Supabase client
 * for client-side operations. This ensures we maintain a single
 * connection throughout the application lifecycle.
 */
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Authentication Methods
 * 
 * Collection of core authentication functions for handling user
 * authentication flows including sign-in, sign-up, and sign-out.
 */

/**
 * Sign in a user with email and password.
 * Attempts to authenticate a user using Supabase authentication.
 * 
 * @param email - User's email address.
 * @param password - User's password.
 * @returns Signed-in user data including session information.
 * @throws Error if sign-in fails with the specific error message from Supabase.
 */
export async function signIn(email: string, password: string) {
  const { error, data } = await supabaseClient.auth.signInWithPassword({
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
 * Creates a new user account in Supabase authentication system.
 * 
 * @param email - User's email address.
 * @param password - User's password.
 * @returns Newly created user data including confirmation status.
 * @throws Error if sign-up fails with the specific error message from Supabase.
 */
export async function signUp(email: string, password: string) {
  const { error, data } = await supabaseClient.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
} 