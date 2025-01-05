import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { withManagerAuth } from '@/lib/auth'
import { env } from '@/lib/env'
import { Database } from '@/types/supabase'

// Create a Supabase admin client
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

export async function POST(request: Request) {
  return withManagerAuth(async () => {
    try {
      const { userIds } = await request.json()

      if (!Array.isArray(userIds)) {
        return NextResponse.json(
          { error: 'userIds must be an array' },
          { status: 400 }
        )
      }

      // Delete each user
      const results = await Promise.all(
        userIds.map(async (id) => {
          const { error } = await supabase.auth.admin.deleteUser(id)
          return { id, success: !error, error: error?.message }
        })
      )

      return NextResponse.json({ results })
    } catch (error) {
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