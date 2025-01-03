import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Create a Supabase client with the service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)

    const { action, data } = body

    if (action === 'update') {
      const { id, weekly_hour_limit, ...rest } = data
      console.log('Updating employee:', id, 'with data:', { weekly_hour_limit, ...rest })

      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({ 
          weekly_hour_limit,
          updated_at: new Date().toISOString(),
          ...rest 
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Update error:', {
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        return NextResponse.json({ error: error.message, details: error.details }, { status: 400 })
      }

      console.log('Update successful:', updatedProfile)
      return NextResponse.json(updatedProfile)
    }

    if (action === 'create') {
      const { email, full_name, role, weekly_hour_limit } = data
      console.log('Creating employee:', { email, full_name, role, weekly_hour_limit })

      // Create user with auth
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password: 'temppass123', // You should implement a proper password system
        email_confirm: true,
        user_metadata: {
          full_name,
          role,
          weekly_hour_limit,
        }
      })

      if (userError) {
        console.error('User creation error:', {
          message: userError.message,
          status: userError.status
        })
        return NextResponse.json({ error: userError.message }, { status: 400 })
      }

      console.log('User creation successful:', userData)
      return NextResponse.json(userData)
    }

    console.error('Invalid action:', action)
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 