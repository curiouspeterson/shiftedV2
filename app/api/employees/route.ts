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
    const body = await request.json()
    console.log('Received request body:', body)

    const { action, data } = body

    if (action === 'delete') {
      const { id } = data
      console.log('Deleting employee:', id)

      // First delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(id)

      if (authError) {
        console.error('Auth deletion error:', authError)
        return NextResponse.json({ error: authError.message }, { status: 400 })
      }

      // The profile will be automatically deleted due to the cascade delete
      console.log('Employee deleted successfully')
      return NextResponse.json({ success: true })
    }

    if (action === 'update') {
      const { id, ...updateData } = data
      console.log('Updating employee:', id, 'with data:', updateData)

      // First do the update
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: updateData.full_name,
          role: updateData.role,
          email: updateData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (updateError) {
        console.error('Update error:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }

      // Then fetch the updated profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Fetch error:', fetchError)
        return NextResponse.json({ error: 'Failed to fetch updated profile' }, { status: 500 })
      }

      console.log('Update successful:', profile)
      return NextResponse.json(profile)
    }

    if (action === 'create') {
      const { email, full_name, role } = data
      console.log('Creating employee:', { email, full_name, role })

      // Create user with auth
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password: 'temppass123', // You should implement a proper password system
        email_confirm: true,
        user_metadata: {
          full_name,
          role
        }
      })

      if (userError) {
        console.error('User creation error:', {
          message: userError.message,
          status: userError.status
        })
        return NextResponse.json({ error: userError.message }, { status: 400 })
      }

      // Fetch the created profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', userData.user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        return NextResponse.json({ error: 'Failed to fetch created profile' }, { status: 500 })
      }

      console.log('User creation successful:', profile)
      return NextResponse.json(profile)
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