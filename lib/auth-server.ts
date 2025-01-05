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

import { createServerSupabaseClient } from './supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Zod schema for validating employee data
 * Ensures all required fields are present and properly formatted
 * before any database operations
 */
const employeeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
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
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()
    const { action, data } = body

    // Handle employee deletion
    if (action === 'delete') {
      const { id } = data
      const { error: authError } = await supabase.auth.admin.deleteUser(id)

      if (authError) {
        throw new Error(authError.message)
      }

      return NextResponse.json({ success: true })
    }

    // Handle employee information updates
    if (action === 'update') {
      const { id, ...updateData } = data
      // Validate input data against schema
      const parsedData = employeeSchema.parse({ id, ...updateData })

      // Update profile information in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: parsedData.name,
          email: parsedData.email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', parsedData.id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      // Fetch and return updated profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', parsedData.id)
        .single()

      if (fetchError) {
        throw new Error('Failed to fetch updated profile')
      }

      return NextResponse.json(profile)
    }

    // Handle new employee creation
    if (action === 'create') {
      const parsedData = employeeSchema.parse(data)
      const { email, name } = parsedData

      // Create auth account for new employee
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          full_name: name,
          role: 'employee', // or 'manager' based on your logic
        },
      })

      if (userError) {
        throw new Error(userError.message)
      }

      // Fetch and return the newly created profile
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