/**
 * Supabase Server-Side Client Configuration Module
 * 
 * This module provides factory functions for creating Supabase clients optimized for
 * server-side operations in a Next.js environment.
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from '../database.types'

// Regular client for authenticated operations
export const createServerClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  )
}

// Admin client with service role for privileged operations
export const createServiceClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Log key format (without exposing the actual key)
  console.log('Service role key format check:', {
    length: supabaseKey.length,
    startsWithEyJ: supabaseKey.startsWith('eyJ'),
    containsDots: supabaseKey.includes('.'),
    isBase64: /^[A-Za-z0-9+/=]+$/.test(supabaseKey)
  })

  return createClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'x-client-info': 'shifted-v2@0.1.0'
        }
      },
      db: {
        schema: 'public'
      }
    }
  )
} 