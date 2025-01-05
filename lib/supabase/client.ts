/**
 * Supabase Client Module
 * 
 * This module exports functions for creating Supabase clients
 * configured for browser and server environments.
 */

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client configured for browser usage
 * with session persistence and URL-based session detection for OAuth flows
 */
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export { createBrowserClient } 