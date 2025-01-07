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

import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for employee creation
const createEmployeeSchema = z.object({
  data: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    role: z.enum(['employee', 'manager']),
    weekly_hour_limit: z.number().min(0).max(168)
  })
})

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json()
    const validatedData = createEmployeeSchema.parse(body)
    const { email, name: full_name, role, weekly_hour_limit } = validatedData.data

    // Initialize service client
    const supabase = createServiceClient()

    // Create user with admin API
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: Math.random().toString(36).slice(-12),
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
        { status: createError.status || 500 }
      )
    }

    if (!newUser?.user) {
      console.error('No user returned from createUser')
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Insert the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: newUser.user.id,
        full_name,
        email,
        role,
        weekly_hour_limit,
        is_active: true
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Clean up the auth user since profile creation failed
      await supabase.auth.admin.deleteUser(newUser.user.id)
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: newUser.user.id,
        full_name,
        email,
        role,
        weekly_hour_limit,
        is_active: true
      }
    })
  } catch (error) {
    console.error('Error in employee creation:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 