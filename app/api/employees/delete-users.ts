import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Create a Supabase client with the service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: 'public'
    }
  }
)

export async function POST(request: Request) {
  try {
    // List of user IDs to delete
    const userIds = [
      '3d98b03b-9999-4c07-93bb-501fee4824fc',
      '339bc6ec-c995-4742-aae4-525c44f62a4f',
      'c154e64f-8915-46f6-96d1-7e8f40969b42'
    ]

    console.log('Attempting to delete users:', userIds)

    for (const id of userIds) {
      // First try to delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(id)

      if (authError) {
        console.error(`Failed to delete user ${id}:`, authError)
        // Try to delete from profiles table directly if auth deletion fails
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id)

        if (profileError) {
          console.error(`Failed to delete profile ${id}:`, profileError)
        } else {
          console.log(`Successfully deleted profile ${id}`)
        }
      } else {
        console.log(`Successfully deleted user ${id}`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting users:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 