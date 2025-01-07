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

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '../database.types'

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}

export const createServiceClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  
  return createServerComponentClient<Database>({
    cookies,
  }, {
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  })
} 