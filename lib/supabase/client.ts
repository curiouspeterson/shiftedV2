/**
 * Client-side Supabase Client
 * 
 * Creates and exports a Supabase client instance for client-side usage.
 * Handles cookie management for authentication.
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../database.types'

// Create a singleton instance with a WeakMap to allow garbage collection
const clientInstanceMap = new WeakMap()

export const createClient = () => {
  // Use window as the key for the WeakMap
  if (typeof window === 'undefined') {
    return createClientComponentClient<Database>()
  }

  if (!clientInstanceMap.has(window)) {
    clientInstanceMap.set(window, createClientComponentClient<Database>())
  }
  return clientInstanceMap.get(window)
}

// Clean up function to be called when needed
export const cleanupClient = () => {
  if (typeof window !== 'undefined' && clientInstanceMap.has(window)) {
    const client = clientInstanceMap.get(window)
    if (client) {
      client.removeAllChannels()
      clientInstanceMap.delete(window)
    }
  }
}

// Ensure cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('unload', cleanupClient)
} 
