/**
 * Employee Management API Routes
 * 
 * This module provides API endpoints for managing employees in the system.
 * It handles operations like creating, updating, and retrieving employee data.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'
import { Database } from '@/lib/database.types'
import { getErrorMessage } from '@/lib/utils'

// Schema for validating employee data
const employeeSchema = z.object({
  email: z.string().email(),
  fullName: z.string(),
  role: z.enum(['manager', 'employee']),
  position: z.string(),
  weeklyHourLimit: z.number().min(0).max(168),
})

// Type for employee data from schema
type EmployeeData = z.infer<typeof employeeSchema>

/**
 * POST /api/employees
 * Creates a new employee in the system
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const data = employeeSchema.parse(body)

    // Create Supabase admin client
    const supabase = createAdminClient()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: Math.random().toString(36).slice(-8),
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName,
      },
    })

    if (authError) {
      console.error('Error creating user:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Create profile in database
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        role: data.role,
        position: data.position,
        weekly_hour_limit: data.weeklyHourLimit,
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Employee created successfully' })
  } catch (error) {
    console.error('Error in POST /api/employees:', error)
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 }
    )
  }
}

/**
 * GET /api/employees
 * Retrieves all employees from the system
 */
export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching employees:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/employees:', error)
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 }
    )
  }
} 