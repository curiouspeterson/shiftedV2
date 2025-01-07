/**
 * Employees API Route
 * 
 * Handles API requests for employee management operations.
 * Provides endpoints for creating, updating, and deleting employees.
 * 
 * Features:
 * - Request validation
 * - Action-based routing
 * - Error handling
 * - Type safety
 * - Server-side processing
 * - Response formatting
 */

import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // Get the current user's session to verify they are a manager
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the user is a manager
    const { data: currentUser } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!currentUser || currentUser.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get the new employee data from the request
    const body = await req.json()
    const { email, name: full_name, role, weekly_hour_limit } = body.data

    // Create the user with admin API using service role client
    const serviceClient = createServiceClient()
    const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name,
        role,
        weekly_hour_limit
      }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      return NextResponse.json(
        { error: createError.message },
        { status: 500 }
      )
    }

    // Wait a short time for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Verify the profile was created
    const { data: profile, error: profileError } = await serviceClient
      .from('profiles')
      .select('*')
      .eq('id', newUser.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Profile creation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, user: profile })
  } catch (error) {
    console.error('Error in employee creation:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 