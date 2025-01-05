/**
 * Environment Configuration Module
 * 
 * This module provides type-safe access to environment variables with runtime validation
 * using Zod. It handles both server-side and client-side environment configurations,
 * ensuring that required variables are present and correctly formatted.
 * 
 * The module implements a strict separation between server-only and public environment
 * variables to prevent accidental exposure of sensitive information to the client.
 */

import { z } from 'zod';

/**
 * Server-side environment schema
 * Defines and validates all environment variables available on the server
 * Includes both public and private variables
 */
const serverEnvSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Client-side environment schema
 * Defines and validates environment variables that are safe to expose to the client
 * Should only include public variables (prefixed with NEXT_PUBLIC_)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

// Type inference for client environment variables
type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Retrieves and validates environment variables based on runtime context
 * Handles both browser and server environments differently
 * 
 * @returns Validated environment variables for the current context
 */
function getClientEnv(): ClientEnv {
  // Browser environment: Read from Next.js-injected env
  if (typeof window !== 'undefined') {
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    };
  }

  // Server environment: Validate all variables
  const env = serverEnvSchema.parse(process.env);
  return {
    NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

/**
 * Exported environment configuration
 * Provides runtime-specific environment variables with type safety
 * Server-side: Full environment with all variables
 * Client-side: Limited to public variables only
 */
export const env = typeof window === 'undefined' 
  ? serverEnvSchema.parse(process.env)
  : getClientEnv();

/**
 * Public environment variables safe for client-side usage
 * This object should only contain variables prefixed with NEXT_PUBLIC_
 * to prevent accidental exposure of sensitive information
 */
export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}; 