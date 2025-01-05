/**
 * Email Verification Page
 * 
 * Server-side component that handles email verification process.
 * This page is accessed after a user clicks the verification link in their email.
 * 
 * Flow:
 * 1. User receives verification email with a link to this page
 * 2. Page checks for valid session
 * 3. If verified, redirects to dashboard
 * 4. If error, displays error message
 * 
 * Note: This must remain a server component to securely handle verification
 */

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Verification page component
 * Processes email verification and manages session state
 * 
 * @param searchParams - URL parameters containing verification token
 * @returns Component showing verification status or redirects on success
 */
export default async function VerifyPage({ searchParams }: { searchParams: URLSearchParams }) {
  const supabase = createServerSupabaseClient()
  
  // Check for valid session
  const { data: { session }, error } = await supabase.auth.getSession()

  // Handle verification errors
  if (error) {
    return <div>Error verifying session: {error.message}</div>
  }

  // Redirect to dashboard if session is valid
  if (session) {
    redirect('/dashboard')
  }

  // Show loading state while verifying
  return <div>Verifying session...</div>
} 