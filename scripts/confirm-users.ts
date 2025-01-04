import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: '.env.local' })

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

async function createAndConfirmUsers() {
  const users = [
    { email: 'frank_new@test.com', full_name: 'Frank Tucker', role: 'employee' },
    { email: 'test_new@test.com', full_name: 'Test User', role: 'employee' },
    { email: 'adamjpeterson@gmail.com', full_name: 'Adam Peterson', role: 'employee' }
  ]

  console.log('Attempting to create and confirm users:', users.map(u => u.email))

  try {
    for (const user of users) {
      // Create the user with admin API
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'temppass123',
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role
        }
      })

      if (createError) {
        console.error(`Failed to create user ${user.email}:`, createError)
        continue
      }

      console.log(`Successfully created user ${user.email}`)

      // Create or update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          is_active: true
        })

      if (profileError) {
        console.error(`Failed to create profile for ${user.email}:`, profileError)
      } else {
        console.log(`Successfully created profile for ${user.email}`)
      }
    }
  } catch (error) {
    console.error('Error processing users:', error)
  }
}

// Run the script
createAndConfirmUsers()
  .then(() => {
    console.log('Finished creation and confirmation attempts')
    process.exit(0)
  })
  .catch(error => {
    console.error('Script failed:', error)
    process.exit(1)
  }) 