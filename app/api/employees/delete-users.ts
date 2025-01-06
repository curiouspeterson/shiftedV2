/**
 * API Route: Delete Users
 * 
 * Protected route that allows managers to delete user accounts.
 * Requires manager authentication.
 */

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { withManagerAuth } from '@/lib/auth.server'
import { env } from '@/lib/env'
import { Database } from '@/types/supabase'

export const POST = withManagerAuth(async (req) => {
  try {
    const { userIds } = await req.json()

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: userIds must be a non-empty array' },
        { status: 400 }
      )
    }

    const supabase = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Delete users one by one
    const results = await Promise.all(
      userIds.map(async (id) => {
        const { error } = await supabase.auth.admin.deleteUser(id)
        return { id, success: !error, error: error?.message }
      })
    )

    const hasErrors = results.some(result => !result.success)
    if (hasErrors) {
      const errors = results.filter(r => !r.success).map(r => r.error)
      throw new Error(`Failed to delete some users: ${errors.join(', ')}`)
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error('Error deleting users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete users' },
      { status: 500 }
    )
  }
}) 