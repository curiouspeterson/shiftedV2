"use client"

import { createClient } from './client'

export async function testConnection() {
  try {
    console.log('Starting connection test...')
    const supabase = createClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log('Auth status:', { 
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email
    })

    // Simple query test
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .limit(1)
    
    console.log('Query test:', { 
      success: !error,
      hasData: !!data?.length,
      error
    })
    
    return !error
  } catch (err) {
    console.error('Connection test failed:', err)
    return false
  }
} 