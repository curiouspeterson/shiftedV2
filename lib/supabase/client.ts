/**
 * Client-side Supabase Client
 * 
 * Creates and exports a Supabase client instance for client-side usage.
 * Handles cookie management for authentication.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import { CookieOptions } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

const isBrowser = typeof window !== 'undefined'

export const createClient = () => {
  if (!isBrowser) {
    throw new Error('Supabase client cannot be used server-side')
  }

  if (supabaseClient) return supabaseClient

  supabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find(row => row.startsWith(name))
            ?.split('=')[1] || ''
        },
        set(name: string, value: string, options: CookieOptions) {
          document.cookie = `${name}=${value}; ${Object.entries(options)
            .map(([key, val]) => `${key}=${val}`)
            .join('; ')}`
        },
        remove(name: string, options: CookieOptions) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${Object.entries(options)
            .map(([key, val]) => `${key}=${val}`)
            .join('; ')}`
        }
      },
      auth: {
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  )

  return supabaseClient
}

// Clean up function to be called when needed
export const cleanupClient = () => {
  if (supabaseClient) {
    supabaseClient.removeAllChannels()
    supabaseClient = null
  }
}

export const getClient = () => {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized')
  }
  return supabaseClient
} 
