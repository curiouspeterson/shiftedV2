import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

// Create a cached version of the Supabase client
export const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies()
  return createServerComponentClient({
    cookies: () => cookieStore
  })
})