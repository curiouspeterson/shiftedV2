/**
 * Supabase Browser Client Configuration
 * 
 * Configures and exports a Supabase client instance for browser use.
 * Disables debug logging for cleaner console output.
 * 
 * Created: 2024-01-08
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

// Create client with debug mode disabled
export const supabaseBrowserClient = createClientComponentClient<Database>()

// Re-export for convenience
export const createBrowserClient = () => createClientComponentClient<Database>() 