"use client"

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/**
 * Test Connection Module
 * 
 * This module provides functionality to test the Supabase connection by:
 * 1. Verifying authentication status and session details
 * 2. Testing database connectivity with a simple query
 * 3. Providing detailed logging for debugging purposes
 * 
 * Returns boolean indicating if connection tests passed successfully
 */

/**
 * Tests the Supabase connection by checking auth status and running a test query
 * @param supabase - The Supabase client instance to use for testing
 * @returns Promise<boolean> - True if connection tests pass, false otherwise
 */
export async function testConnection(supabase: SupabaseClient<Database>) {
  try {
    // Initialize connection test
    console.log('Starting connection test...')
    
    // Test authentication by retrieving current session
    // This verifies that auth is properly configured and working
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Auth status:', { 
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email
    })

    // Test database connectivity by running a simple query
    // This verifies database access and RLS policies are working
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .limit(1)
    
    console.log('Query test:', { 
      success: !error,
      hasData: !!data?.length,
      error
    })
    
    // Return true if no errors occurred during testing
    return !error
  } catch (err) {
    // Log any unexpected errors and return false to indicate test failure
    console.error('Connection test failed:', err)
    return false
  }
} 