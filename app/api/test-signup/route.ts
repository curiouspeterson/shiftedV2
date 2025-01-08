import { NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'

export async function GET() {
  try {
    // 1. Sign up a new user
    console.log('Creating test user...')
    const { user, session } = await signUp(
      'testuser@gmail.com',
      'Test123!',
      'Test User',
      'employee',
      'Dispatcher'
    )

    if (!user) {
      throw new Error('Failed to create user')
    }

    console.log('User created:', { user, session })

    // 2. Verify profile was created
    const supabase = createClient()
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'testuser@gmail.com')
      .single()

    if (profileError) {
      throw profileError
    }

    console.log('Profile created:', profile)
    
    return NextResponse.json({ success: true, user, session, profile })
  } catch (error) {
    console.error('Error during test:', error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
} 