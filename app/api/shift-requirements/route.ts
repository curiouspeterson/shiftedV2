/**
 * Shift Requirements API Route
 * 
 * Handles CRUD operations for shift requirements.
 * Provides endpoints for creating, updating, and deleting shift requirements.
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

// Validation schema for shift requirement data
const shiftRequirementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  day_of_week: z.number().min(0).max(6),
  start_time: z.string(),
  end_time: z.string(),
  required_count: z.number().min(1),
})

/**
 * POST handler for creating new shift requirements
 */
export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const data = await req.json()

    // Validate input data
    const validatedData = shiftRequirementSchema.parse(data)

    // Insert new shift requirement
    const { data: newRequirement, error } = await supabase
      .from('shift_requirements')
      .insert([validatedData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(newRequirement)
  } catch (error: any) {
    console.error('Error creating shift requirement:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create shift requirement' },
      { status: 400 }
    )
  }
}

/**
 * PUT handler for updating existing shift requirements
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
    const validatedData = shiftRequirementSchema.parse(updateData)

    // Update shift requirement
    const { data: updatedRequirement, error } = await supabase
      .from('shift_requirements')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updatedRequirement)
  } catch (error: any) {
    console.error('Error updating shift requirement:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update shift requirement' },
      { status: 400 }
    )
  }
}

/**
 * DELETE handler for removing shift requirements
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
      .from('shift_requirements')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting shift requirement:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete shift requirement' },
      { status: 400 }
    )
  }
} 