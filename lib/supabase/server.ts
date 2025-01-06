/**
 * Supabase Server-Side Client Configuration Module
 * 
 * This module provides factory functions for creating Supabase clients optimized for
 * server-side operations in a Next.js environment. It handles cookie-based session
 * management and provides both regular and administrative access clients.
 * 
 * The module integrates with Next.js's built-in cookie handling system and supports
 * type-safe database operations through the Database type.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'
import { env } from '@/lib/env'

/**
 * Creates a standard Supabase client for server-side operations
 * This client uses the anonymous key and is suitable for regular user operations
 * with proper session management through cookies
 * 
 * @returns A typed Supabase client with cookie-based session handling
 */
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie error in development
            console.error('Cookie set error:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // Handle cookie error in development
            console.error('Cookie remove error:', error)
          }
        },
      },
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    }
  )
}

/**
 * Creates an administrative Supabase client with elevated privileges
 * This client uses the service role key and is intended for administrative
 * operations that require bypassing RLS policies
 * 
 * IMPORTANT: This client should only be used for authorized administrative tasks
 * and never exposed to the client side
 * 
 * @returns A typed Supabase admin client with elevated privileges
 */
export function createAdminClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        // Disable token auto-refresh for admin client
        autoRefreshToken: false,
        // Disable session persistence for admin client
        persistSession: false,
      },
      cookies: {
        // Get cookie value by name
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Set cookie with name, value, and options
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        // Remove cookie by name
        remove(name: string, options: CookieOptions) {
          cookieStore.delete(name)
        },
      },
    }
  )
} 