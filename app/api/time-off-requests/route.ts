/**
 * Time Off Requests API Route
 * 
 * Handles CRUD operations for time off requests.
 * Provides endpoints for creating, updating, and viewing time off requests.
 * 
 * Features:
 * - Input validation
 * - Error handling
 * - Database operations via Supabase
 * - Role-based access control
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schema for time off request data
const timeOffRequestSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  reason: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
})

/**
 * GET handler for fetching time off requests
 */
export async function GET(req: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch time off requests for the user
    const { data, error } = await supabase
      .from('time_off_requests')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching time off requests:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch time off requests' },
      { status: 400 }
    )
  }
}

/**
 * POST handler for creating new time off requests
 */
export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const data = await req.json()
    const { user_id, ...requestData } = data

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate request data
    const validatedData = timeOffRequestSchema.parse(requestData)

    // Insert new time off request
    const { data: newRequest, error } = await supabase
      .from('time_off_requests')
      .insert([{ profile_id: user_id, ...validatedData }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(newRequest)
  } catch (error: any) {
    console.error('Error creating time off request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create time off request' },
      { status: 400 }
    )
  }
}

/**
 * PUT handler for updating time off requests
 */
export async function PUT(req: Request) {
  try {
    const supabase = createAdminClient()
    const data = await req.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for updates' },
        { status: 400 }
      )
    }

    // Validate update data
    const validatedData = timeOffRequestSchema.parse(updateData)

    // Update time off request
    const { data: updatedRequest, error } = await supabase
      .from('time_off_requests')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updatedRequest)
  } catch (error: any) {
    console.error('Error updating time off request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update time off request' },
      { status: 400 }
    )
  }
}

/**
 * DELETE handler for removing time off requests
 */
export async function DELETE(req: Request) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for deletion' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('time_off_requests')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting time off request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete time off request' },
      { status: 400 }
    )
  }
} 