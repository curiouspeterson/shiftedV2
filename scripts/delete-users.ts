/**
 * User Deletion Script
 * 
 * This script provides functionality to delete all users from the Supabase authentication system.
 * It uses the Supabase admin API with service role credentials to:
 * 1. List all users in the system
 * 2. Delete each user one by one
 * 3. Log the results of each deletion attempt
 * 
 * Note: This script should be used with caution as it permanently deletes user accounts.
 * Requires SUPABASE_SERVICE_ROLE_KEY environment variable to be set.
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
 * Deletes all users from the Supabase authentication system
 * 
 * Process:
 * 1. Fetches complete list of users using admin API
 * 2. Iterates through each user and attempts deletion
 * 3. Logs successful deletions and any errors encountered
 * 
 * Error handling:
 * - Catches and logs any errors during user listing
 * - Continues to next user if deletion of current user fails
 */
async function deleteUsers() {
  try {
    // Fetch all users from Supabase auth
    const { data: users, error } = await supabase.auth.admin.listUsers()
    if (error) throw error

    // Iterate through users and delete each one
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

// Execute the deletion script
deleteUsers() 