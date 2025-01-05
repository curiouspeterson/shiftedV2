/**
 * Supabase Configuration Module
 * 
 * This module exports the core configuration needed to initialize Supabase clients.
<<<<<<< HEAD
 * It ensures that required environment variables are present and properly typed.
 */

/**
 * Core configuration object for Supabase clients
 */
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
} as const

/**
 * Type guard to ensure all required environment variables are present
 */
if (!supabaseConfig.url || !supabaseConfig.anonKey || !supabaseConfig.serviceRoleKey) {
  throw new Error('Missing required Supabase environment variables')
=======
 * It provides the essential connection details (URL and anonymous key) required
 * for client-side Supabase operations. These values are sourced from environment
 * variables to maintain security and enable different configurations per environment.
 */

import { env } from '../env'

/**
 * Client-side Supabase Configuration Object
 * 
 * Contains the minimal required configuration for initializing a client-side
 * Supabase instance. Uses public environment variables that are safe to expose
 * in browser contexts.
 * 
 * @property url - The URL of your Supabase project instance
 * @property anonKey - The anonymous key for public client-side access
 */
export const supabaseConfig = {
  url: env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
} 