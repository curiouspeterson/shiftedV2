import { NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'

export async function GET() {
  try {
    // Create test users with different roles
    const testUsers = [
      {
        email: 'employee@test.com',
        name: 'Test Employee',
        role: 'Employee' as const,
        position: 'Dispatcher' as const
      },
      {
        email: 'supervisor@test.com',
        name: 'Test Supervisor',
        role: 'Employee' as const,
        position: 'Shift Supervisor' as const
      },
      {
        email: 'manager@test.com',
        name: 'Test Manager',
        role: 'Manager' as const,
        position: 'Management' as const
      },
      {
        email: 'admin@test.com',
        name: 'Test Admin',
        role: 'Admin' as const,
        position: 'Management' as const
      }
    ]

    const results = []
    
    for (const user of testUsers) {
      console.log(`Creating ${user.role}: ${user.email}...`)
      const signUpResult = await signUp(
        user.email,
        'Test123!',
        user.name,
        user.role,
        user.position
      )

      if (!signUpResult.user) {
        throw new Error(`Failed to create user: ${user.email}`)
      }

      // Wait a moment for the trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Verify profile was created
      const supabase = createClient()
      console.log(`Checking profile for ${user.email}...`)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signUpResult.user.id)
        .single()

      if (profileError) {
        console.error(`Profile error for ${user.email}:`, profileError)
        throw profileError
      }

      if (!profile) {
        console.error(`No profile found for ${user.email}`)
        throw new Error('Profile was not created')
      }

      console.log(`Profile created for ${user.email}:`, profile)
      results.push({ user: signUpResult.user, profile })
    }
    
    return NextResponse.json({ 
      success: true,
      results
    })
  } catch (error) {
    console.error('Error during test:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { 
      status: 500 
    })
  }
} 