import { createServerSupabaseClient } from './supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Define schemas using Zod for validation
const employeeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  // Add more fields as needed
})

/**
 * Handles employee-related actions such as create, update, and delete.
 * @param request - Incoming request containing action and data.
 * @returns JSON response based on the action outcome.
 */
export async function handleEmployeeAction(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    const body = await request.json()
    const { action, data } = body

    if (action === 'delete') {
      const { id } = data
      const { error: authError } = await supabase.auth.admin.deleteUser(id)

      if (authError) {
        throw new Error(authError.message)
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'update') {
      const { id, ...updateData } = data
      const parsedData = employeeSchema.parse({ id, ...updateData })

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

    if (action === 'create') {
      const parsedData = employeeSchema.parse(data)
      const { email, name } = parsedData

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