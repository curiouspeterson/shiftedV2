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

async function confirmUsers() {
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    for (const user of users.users) {
      if (!user.email_confirmed_at) {
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          user.id,
          { email_confirm: true }
        )
        if (confirmError) {
          console.error(`Failed to confirm user ${user.id}:`, confirmError)
          continue
        }
        console.log(`Confirmed user ${user.id}`)
      }
    }
  } catch (error) {
    console.error('Error confirming users:', error)
  }
}

confirmUsers() 