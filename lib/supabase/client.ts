/**
 * Client-side Supabase Client
 * 
 * Creates and exports a Supabase client instance for client-side usage.
 * Handles cookie management for authentication.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../database.types'

let client: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  client = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      debug: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-client-info': 'shifted-v2@0.1.0'
      }
    },
    realtime: {
      params: {
        log_level: 'debug'
      }
    }
  })

  return client
} 
