/**
 * Server-Side Authentication and Employee Management Module
 * 
 * This module provides server-side functionality for managing employee accounts,
 * including creation, updates, and deletion. It uses Supabase for authentication
 * and database operations, with Zod for request validation.
 * 
 * The module ensures data integrity through schema validation and proper error
 * handling for all operations.
 */

import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { z as zod } from 'zod'
import { Database } from '@/types/supabase'

/**
 * Zod schema for validating employee data
 * Ensures all required fields are present and properly formatted
 * before any database operations
 */
const employeeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["employee", "manager"]),
  weekly_hour_limit: z.number().min(0).max(168).default(40),
  // Add more fields as needed
})

/**
 * Handles CRUD operations for employee management
 * Supports three main actions:
 * - create: Creates a new employee with auth account and profile
 * - update: Updates existing employee information
 * - delete: Removes an employee and their associated auth account
 *
 * @param request - HTTP request containing action type and employee data
 * @returns NextResponse with operation result or error details
 */
export async function handleEmployeeAction(request: Request) {
  const supabase = createServerSupabaseClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SERVICE_ROLE_KEY!, // Ensure this is securely stored
  })

  try {
    const body = await request.json()
    const { action, data } = body

    // Validate input data
    if (!employeeSchema.safeParse(data).success) {
      throw new Error('Invalid employee data')
    }

    const parsedData = employeeSchema.parse(data)

    if (action === 'delete') {
      const { id } = parsedData

      // Delete the user using the Supabase admin client
      const { error: deleteError } = await supabase.auth.admin.deleteUser(id)

      if (deleteError) {
        throw deleteError
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'update') {
      const { id, name, email, role, weekly_hour_limit } = parsedData

      // Update profile information in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          email: email,
          role: role,
          weekly_hour_limit: weekly_hour_limit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      // Fetch and return updated profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        throw new Error('Failed to fetch updated profile')
      }

      return NextResponse.json(profile)
    }

    if (action === 'create') {
      const { email, name, role, weekly_hour_limit } = parsedData

      // Create auth account for new employee
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password: 'tempPassword123!', // Replace with secure password
        email_confirm: true,
        data: {
          full_name: name,
          role: role,
          weekly_hour_limit: weekly_hour_limit,
        },
      })

      if (userError) {
        throw userError
      }

      if (!userData.user) {
        throw new Error('Failed to create user')
      }

      // Optionally, you can wait or verify the profile creation
      // Depending on your Supabase trigger configuration

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single()

      if (profileError) {
        throw new Error('Failed to fetch created profile')
      }

      return NextResponse.json(profile)
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    // Comprehensive error logging and response
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
 * Higher-order function to protect routes that require manager authentication.
 *
 * @param handler - The route handler to protect.
 * @returns Protected route handler that first validates manager authentication.
 */
export function withManagerAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const supabase = createServerSupabaseClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.SERVICE_ROLE_KEY!, // Ensure this is securely stored
    })

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      console.error('Authentication error:', error)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Error fetching profile' }, { status: 500 })
    }

    if (!profile || profile.role !== 'manager') {
      console.warn(`Unauthorized access attempt by user: ${session.user.id} with role: ${profile?.role}`)
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return handler(req)
  }
} 