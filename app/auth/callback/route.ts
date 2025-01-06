/**
 * Authentication Callback Route
 * 
 * Handles OAuth callback requests from Supabase authentication.
 * Processes authentication code and establishes user session.
 * 
 * Features:
 * - OAuth code exchange
 * - Session management
 * - Cookie handling
 * - Error handling
 * - Secure redirects
 * - Type safety
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { env } from '@/lib/env'

// Base URL for redirects
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// Mark route as dynamic
export const dynamic = 'force-dynamic'

/**
 * GET request handler
 * Processes authentication callback and establishes session
 * 
 * @param request - Incoming request object
 * @returns Redirect response to appropriate page
 */
export async function GET(request: Request) {
  try {
    // Extract authentication code from URL
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const cookieStore = cookies()

    if (code) {
      // Initialize Supabase client with cookie handling
      const supabase = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            // Cookie getter
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            // Cookie setter
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options })
            },
            // Cookie remover
            remove(name: string, options: CookieOptions) {
              cookieStore.delete(name)
            },
          },
        }
      )

      // Exchange code for session
      await supabase.auth.exchangeCodeForSession(code)
    }

    // Redirect to dashboard on success
    return NextResponse.redirect(new URL('/dashboard', baseUrl))
  } catch (error) {
    // Log error and redirect to login with error parameter
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=auth_callback_failed', baseUrl))
  }
} 