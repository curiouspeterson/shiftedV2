/**
 * Client-side Supabase Client
 * 
 * Creates and exports a Supabase client instance for client-side usage.
 * Handles cookie management for authentication.
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../database.types'

// Create a singleton instance
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (!clientInstance) {
    clientInstance = createClientComponentClient<Database>()
  }
  return clientInstance
}

// Clean up function to be called when needed
export const cleanupClient = () => {
  if (clientInstance) {
    clientInstance.removeAllChannels()
    clientInstance = null
  }
} 
