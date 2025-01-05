/**
 * Supabase Configuration Module
 * 
 * This module exports the core configuration needed to initialize Supabase clients.
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
} 