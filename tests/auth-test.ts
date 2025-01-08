const { signUp } = require('../lib/auth')
const { createClient } = require('../lib/supabase/client')

async function testUserSignup() {
  try {
    // 1. Sign up a new user
    console.log('Creating test user...')
    const { user, session } = await signUp(
      'test@example.com',
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
      .eq('email', 'test@example.com')
      .single()

    if (profileError) {
      throw profileError
    }

    console.log('Profile created:', profile)
    
    return { success: true, user, session, profile }
  } catch (error) {
    console.error('Error during test:', error)
    return { success: false, error }
  }
}

// Run the test
testUserSignup() 