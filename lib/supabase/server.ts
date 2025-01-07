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

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '../database.types'

export const createServerClient = () => {
  const cookieStore = cookies()
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // Handle cookie errors in middleware
          }
        },
        remove: (name: string, options: any) => {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            // Handle cookie errors in middleware
          }
        },
      },
    }
  )
}

export const createServiceClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
} 