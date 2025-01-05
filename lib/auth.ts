<<<<<<< HEAD
'use client'

import { createBrowserClient } from './supabase/client'
=======
/**
 * Authentication Utility Module
 * 
 * This module provides comprehensive authentication functionality using Supabase,
 * including user sign-in, sign-up, sign-out, and route protection capabilities.
 * It handles both client-side authentication flows and server-side route protection,
 * particularly for manager-level access control.
 */

import { createBrowserClient } from './supabase/client'
import { Database } from '@/types/supabase'
import { NextRequest, NextResponse } from 'next/server'
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589

/**
 * Supabase Client Instance
 * 
 * Creates and exports a singleton instance of the Supabase client
 * for client-side operations. This ensures we maintain a single
 * connection throughout the application lifecycle.
 */
<<<<<<< HEAD
export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
=======
export const supabaseClient = createBrowserClient()
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589

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
<<<<<<< HEAD
=======
}

/**
 * Sign out the current user.
 * Terminates the current user session in Supabase.
 * 
 * @throws Error if sign-out operation fails with the specific error message from Supabase.
 */
export async function signOut() {
  const { error } = await supabaseClient.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Route Protection
 * 
 * Authentication middleware for protecting routes that require
 * manager-level access. This higher-order function wraps route
 * handlers to ensure only authenticated managers can access
 * certain endpoints.
 */

/**
 * Higher-order function to protect routes that require manager authentication.
 * Verifies both user authentication and manager role before allowing access.
 * 
 * @param handler - The route handler to protect.
 * @returns Protected route handler that first validates manager authentication.
 */
export function withManagerAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const supabase = createBrowserClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    // Check for valid authentication session
    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify manager role in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Ensure user has manager role
    if (!profile || profile.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return handler(req)
  }
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
} 