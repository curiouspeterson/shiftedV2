/**
 * API Route: Delete Employees
 * 
 * This API endpoint handles the deletion of multiple employee users from the system.
 * It requires manager authentication and uses Supabase's admin client for user deletion.
 * The route accepts an array of user IDs and attempts to delete each user, returning
 * the results of each deletion operation.
 */

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { withManagerAuth } from '@/lib/auth'
import { env } from '@/lib/env'
import { Database } from '@/types/supabase'

// Initialize Supabase admin client with service role key for administrative operations
// This client has elevated privileges and should only be used server-side
const supabase = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * POST handler for bulk user deletion
 * @param request - Contains an array of user IDs to be deleted
 * @returns NextResponse with results of deletion operations
 */
export async function POST(request: Request) {
  return withManagerAuth(async () => {
    try {
      const { userIds } = await request.json()

      // Input validation to ensure userIds is an array
      if (!Array.isArray(userIds)) {
        return NextResponse.json(
          { error: 'userIds must be an array' },
          { status: 400 }
        )
      }

      // Process each user deletion in parallel and collect results
      const results = await Promise.all(
        userIds.map(async (id) => {
          const { error } = await supabase.auth.admin.deleteUser(id)
          return { id, success: !error, error: error?.message }
        })
      )

      return NextResponse.json({ results })
    } catch (error) {
      // Error handling with detailed error information for debugging
      console.error('Delete users error:', error)
      return NextResponse.json(
        { 
          error: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error instanceof Error ? error.stack : undefined
        },
        { status: 500 }
      )
    }
  })
} 