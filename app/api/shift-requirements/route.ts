/**
 * Shift Requirements API Route Handler
 * 
 * This module provides REST API endpoints for managing shift requirements in the system.
 * All endpoints require authentication and manager-level access.
 * 
 * Endpoints:
 * - POST: Create a new shift requirement
 * - PUT: Update an existing shift requirement
 * - DELETE: Remove a shift requirement
 * 
 * Security:
 * - All routes verify user authentication
 * - All routes verify manager role authorization
 * - Input validation is performed before database operations
 */

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * POST /api/shift-requirements
 * Creates a new shift requirement
 * 
 * @param request - Contains the shift requirement data in the request body
 * @returns The newly created shift requirement or error response
 */
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    // Verify user authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify manager role authorization
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError) throw profileError
    if (profile?.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden - Managers only' }, { status: 403 })
    }

    // Process and insert new shift requirement
    const shiftData = await request.json()
    const { data, error } = await supabase
      .from('shift_requirements')
      .insert([shiftData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/shift-requirements
 * Updates an existing shift requirement
 * 
 * @param request - Contains the shift requirement ID and updated data
 * @returns The updated shift requirement or error response
 */
export async function PUT(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    // Verify user authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify manager role authorization
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError) throw profileError
    if (profile?.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden - Managers only' }, { status: 403 })
    }

    // Extract ID and update data from request
    const { id, ...updateData } = await request.json()

    // Update shift requirement in database
    const { data, error } = await supabase
      .from('shift_requirements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/shift-requirements
 * Removes a shift requirement from the system
 * 
 * @param request - Contains the shift requirement ID as a URL parameter
 * @returns Success confirmation or error response
 */
export async function DELETE(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    // Verify user authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify manager role authorization
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError) throw profileError
    if (profile?.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden - Managers only' }, { status: 403 })
    }

    // Extract and validate shift requirement ID
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing shift requirement ID' }, { status: 400 })
    }

    // Delete shift requirement from database
    const { error } = await supabase
      .from('shift_requirements')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    )
  }
} 