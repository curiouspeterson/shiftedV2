// This should be a server component
// Remove "use client" if it's present

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Handles email verification by extracting the session from the URL.
 * @param searchParams - URLSearchParams containing the verification code.
 * @returns JSX element indicating the verification status.
 */
export default async function VerifyPage({ searchParams }: { searchParams: URLSearchParams }) {
  const supabase = createServerSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    return <div>Error verifying session: {error.message}</div>
  }

  if (session) {
    redirect('/dashboard')
  }

  return <div>Verifying session...</div>
} 