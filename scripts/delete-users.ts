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

async function deleteUsers() {
  const userIds = [
    '3d98b03b-9999-4c07-93bb-501fee4824fc',  // frank_new@test.com
    '339bc6ec-c995-4742-aae4-525c44f62a4f',  // test_new@test.com
    'c154e64f-8915-46f6-96d1-7e8f40969b42'   // adamjpeterson@gmail.com
  ]

  console.log('Attempting to delete users:', userIds)

  for (const id of userIds) {
    try {
      // First try to delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (profileError) {
        console.error(`Failed to delete profile ${id}:`, profileError)
      } else {
        console.log(`Successfully deleted profile ${id}`)
      }

      // Then try to delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(id)

      if (authError) {
        console.error(`Failed to delete user ${id} from auth:`, authError)
      } else {
        console.log(`Successfully deleted user ${id} from auth`)
      }
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error)
    }
  }
}

// Run the script
deleteUsers()
  .then(() => {
    console.log('Finished deletion attempts')
    process.exit(0)
  })
  .catch(error => {
    console.error('Script failed:', error)
    process.exit(1)
  }) 