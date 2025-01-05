/**
 * Supabase Configuration Module
 * 
 * This module exports the core configuration needed to initialize Supabase clients.
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
} 