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
<<<<<<< HEAD
import { withManagerAuth } from '@/lib/auth.server'

// Base schema for shift requirement data
const baseShiftRequirementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  required_count: z.number().min(1),
})

// Schema for creating a new shift requirement
const createShiftRequirementSchema = baseShiftRequirementSchema

// Schema for updating an existing shift requirement
const updateShiftRequirementSchema = z.object({
  id: z.string(),
  ...baseShiftRequirementSchema.shape
})

/**
 * POST handler for creating new shift requirements
 */
export const POST = withManagerAuth(async (req: Request) => {
  try {
    console.log('1. Starting POST request handler')
    const supabase = createAdminClient()
    
    console.log('2. Parsing request body')
    const data = await req.json()
    console.log('   Request data:', data)

    // Validate input data
    console.log('3. Validating data')
    const validatedData = createShiftRequirementSchema.parse(data)
    console.log('   Validated data:', validatedData)

    // Insert new shift requirement
    console.log('4. Inserting into database')
=======

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
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
    const { data: newRequirement, error } = await supabase
      .from('shift_requirements')
      .insert([validatedData])
      .select()
      .single()

<<<<<<< HEAD
    if (error) {
      console.error('   Database error:', error)
      throw error
    }

    console.log('5. Insert successful:', newRequirement)
    return NextResponse.json(newRequirement)
  } catch (error: any) {
    console.error('Error in POST handler:', error)
=======
    if (error) throw error

    return NextResponse.json(newRequirement)
  } catch (error: any) {
    console.error('Error creating shift requirement:', error)
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
    return NextResponse.json(
      { error: error.message || 'Failed to create shift requirement' },
      { status: 400 }
    )
  }
<<<<<<< HEAD
})
=======
}
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589

/**
 * PUT handler for updating existing shift requirements
 */
<<<<<<< HEAD
export const PUT = withManagerAuth(async (req: Request) => {
  try {
    console.log('1. Starting PUT request handler')
    const supabase = createAdminClient()
    
    // Parse request body
    let data
    try {
      console.log('2. Parsing request body')
      const rawBody = await req.text()
      console.log('   Raw request body:', rawBody)
      data = JSON.parse(rawBody)
      console.log('   Parsed data:', data)
    } catch (parseError) {
      console.error('   JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Extract and validate ID
    const { id, ...updateData } = data
    console.log('3. Extracted data:', { id, updateData })

    if (!id) {
      console.log('   Missing ID in request')
=======
export async function PUT(req: Request) {
  try {
    const supabase = createAdminClient()
    const data = await req.json()
    const { id, ...updateData } = data

    if (!id) {
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
      return NextResponse.json(
        { error: 'ID is required for updates' },
        { status: 400 }
      )
    }

    // Validate update data
<<<<<<< HEAD
    let validatedData
    try {
      console.log('4. Validating update data')
      validatedData = baseShiftRequirementSchema.parse(updateData)
      console.log('   Validation successful:', validatedData)
    } catch (validationError: any) {
      console.error('   Validation error:', validationError)
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationError.errors || validationError.message
        },
        { status: 400 }
      )
    }

    // Update shift requirement
    console.log('5. Updating database')
    const { data: updatedRequirement, error: dbError } = await supabase
=======
    const validatedData = shiftRequirementSchema.parse(updateData)

    // Update shift requirement
    const { data: updatedRequirement, error } = await supabase
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
      .from('shift_requirements')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

<<<<<<< HEAD
    if (dbError) {
      console.error('   Database error:', dbError)
      return NextResponse.json(
        { error: dbError.message || 'Database update failed' },
        { status: 500 }
      )
    }

    if (!updatedRequirement) {
      console.log('   No record found to update')
      return NextResponse.json(
        { error: 'Shift requirement not found' },
        { status: 404 }
      )
    }

    console.log('6. Update successful:', updatedRequirement)
    return NextResponse.json(updatedRequirement)
  } catch (error: any) {
    console.error('Error in PUT handler:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
})
=======
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
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589

/**
 * DELETE handler for removing shift requirements
 */
export async function DELETE(req: Request) {
<<<<<<< HEAD
  return withManagerAuth(async () => {
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
  })
=======
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
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
} 