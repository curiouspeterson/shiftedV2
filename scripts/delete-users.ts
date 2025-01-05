import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

async function deleteUsers() {
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    for (const user of users.users) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
      if (deleteError) {
        console.error(`Failed to delete user ${user.id}:`, deleteError)
        continue
      }
      console.log(`Deleted user ${user.id}`)
    }
  } catch (error) {
    console.error('Error deleting users:', error)
  }
}

deleteUsers() 