/**
 * Email Verification Page
 * 
 * This page handles email verification after a user signs up or requests a password reset.
 * It processes the verification token from the URL and redirects the user accordingly.
 */

import { redirect, notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { EmailOtpType } from '@supabase/supabase-js'
import { Metadata } from 'next'
import { headers } from 'next/headers'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Verify Email',
    description: 'Verify your email address to complete the signup process.',
  }
}

export async function generateStaticParams() {
  return []
}

type SearchParams = {
  token_hash?: string
  type?: string
  next?: string
  error?: string
  error_code?: string
  error_description?: string
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const headersList = headers()

  const {
    token_hash,
    type,
    next = '/dashboard',
    error_description,
  } = searchParams

  if (error_description) {
    throw new Error(error_description)
  }

  if (!token_hash || !type) {
    notFound()
  }

  const supabase = await createServerClient()

  const { error } = await supabase.auth.verifyOtp({
    type: type as EmailOtpType,
    token_hash,
  })

  if (error) {
    throw new Error(error.message)
  }

  return redirect(next)
} 