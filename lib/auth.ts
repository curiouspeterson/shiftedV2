import { createBrowserClient } from './supabase/client'
import { Database } from '@/types/supabase'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client for client-side usage
export const supabaseClient = createBrowserClient()

// Client-side authentication helper functions

/**
 * Sign in a user with email and password.
 * @param email - User's email address.
 * @param password - User's password.
 * @returns Signed-in user data.
 * @throws Error if sign-in fails.
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
 * @param email - User's email address.
 * @param password - User's password.
 * @returns Signed-up user data.
 * @throws Error if sign-up fails.
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

/**
 * Sign out the current user.
 * @throws Error if sign-out fails.
 */
export async function signOut() {
  const { error } = await supabaseClient.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Higher-order function to protect routes that require manager authentication.
 * @param handler - The route handler to protect.
 * @returns Protected route handler.
 */
export function withManagerAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const supabase = createBrowserClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return handler(req)
  }
} 