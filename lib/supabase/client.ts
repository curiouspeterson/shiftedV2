/**
 * Supabase Client Module
 * 
<<<<<<< HEAD
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
=======
 * This module provides factory functions for creating typed Supabase client instances
 * for browser-side usage. It configures the clients with proper authentication settings
 * and type definitions for the database schema.
 * 
 * The module exports two client creation functions:
 * - createBrowserClient: The primary function for creating browser clients
 * - createClient: An alias function that maintains backwards compatibility
 * 
 * Both functions create clients with identical configuration, ensuring:
 * - Proper typing with the Database type definition
 * - Persistent authentication sessions
 * - Automatic session detection from URL parameters
 * - Safe usage of public credentials from environment variables
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config'
import { Database } from '@/types/supabase'

/**
 * Creates and configures a Supabase client for client-side usage.
 * This is the primary factory function for creating browser-side clients.
 * 
 * Configuration includes:
 * - Type safety through Database type definition
 * - Authentication session persistence
 * - URL-based session detection for OAuth flows
 * - Public credentials from environment config
 * 
 * @returns A fully configured Supabase client instance with proper typing
 */
export const createBrowserClient = () => {
  return createSupabaseClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: true, // Maintains session across page reloads
      detectSessionInUrl: true, // Enables OAuth callback handling
    },
  })
}

/**
 * Legacy client creation function that mirrors createBrowserClient.
 * Maintained for backwards compatibility with existing code.
 * 
 * This function is functionally identical to createBrowserClient and
 * should be considered deprecated for new code. Use createBrowserClient instead.
 * 
 * @returns A fully configured Supabase client instance with proper typing
 * @deprecated Use createBrowserClient for new code
 */
export const createClient = () => {
  return createSupabaseClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
} 
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
