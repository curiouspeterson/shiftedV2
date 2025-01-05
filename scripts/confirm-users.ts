/**
 * User Email Confirmation Script
 * 
 * This script provides functionality to automatically confirm email addresses for all unconfirmed users
 * in the Supabase authentication system. It uses the Supabase admin API with service role credentials to:
 * 1. List all users in the system
 * 2. Identify users with unconfirmed emails
 * 3. Update their email confirmation status
 * 4. Log the results of each confirmation attempt
 * 
 * Note: This script requires SUPABASE_SERVICE_ROLE_KEY environment variable to be set.
 * It should be used carefully as it bypasses the normal email verification process.
 */

// Import required dependencies
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

// Initialize Supabase client with admin privileges
// Disable token refresh and session persistence since this is a one-time script
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

/**
 * Confirms emails for all unconfirmed users in the Supabase authentication system
 * 
 * Process:
 * 1. Fetches complete list of users using admin API
 * 2. Filters for users with unconfirmed emails
 * 3. Updates each unconfirmed user's status to confirmed
 * 4. Logs successful confirmations and any errors encountered
 * 
 * Error handling:
 * - Catches and logs any errors during user listing
 * - Continues to next user if confirmation of current user fails
 */
async function confirmUsers() {
  try {
    // Fetch all users from Supabase auth
    const { data: users, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    // Iterate through users and confirm emails for unconfirmed users
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

// Execute the confirmation script
confirmUsers() 