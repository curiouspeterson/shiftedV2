/**
 * Client-side Supabase Client
 * 
 * Creates and exports a Supabase client instance for client-side usage.
 * Handles cookie management for authentication.
 */

import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'
import { type Database } from '@/types/supabase'

/**
 * Creates a Supabase client for client-side usage
 * @returns Supabase client instance
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
} 
