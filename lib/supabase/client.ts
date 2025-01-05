import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config'
import { Database } from '@/types/supabase'

/**
 * Creates and configures a Supabase client for client-side usage.
 * @returns Supabase client instance.
 */
export const createBrowserClient = () => {
  return createSupabaseClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

/**
 * Creates a typed Supabase client for use in the browser.
 * @returns Supabase client instance with Database type.
 */
export const createClient = () => {
  return createSupabaseClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
} 