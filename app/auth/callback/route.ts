/**
 * Authentication Callback Route
 * 
<<<<<<< HEAD
 * Handles authentication callbacks and session management.
 * Sets up cookies for session persistence.
=======
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
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

<<<<<<< HEAD
export async function POST(request: Request) {
  try {
    const { event, session } = await request.json()

    if (!session?.access_token || !session?.refresh_token) {
      throw new Error('Invalid session data')
    }

    // Create a minimal response
    const response = NextResponse.json({ status: 'success' })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Only set essential auth cookies
            if (name === 'sb-access-token' || name === 'sb-refresh-token') {
              response.cookies.set({
                name,
                value,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                httpOnly: true,
                path: '/'
              })
            }
          },
          remove(name: string, options: CookieOptions) {
            if (name === 'sb-access-token' || name === 'sb-refresh-token') {
              response.cookies.set({
                name,
                value: '',
                maxAge: 0,
                path: '/'
              })
            }
          },
        },
      }
    )

    // Set session with minimal data
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    })

    return response
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
=======
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
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const cookieStore = cookies()

    if (code) {
      // Initialize Supabase client with cookie handling
      const supabase = createServerClient(
        'https://wgpehvclyqlyhseqdmqj.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndncGVodmNseXFseWhzZXFkbXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NDI5MzksImV4cCI6MjA1MTUxODkzOX0.owN6sfxK_IPPeGqqhA-bvegoM9U5d_uPKBJMe4YBsys',
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
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    // Log error and redirect to login with error parameter
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url))
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
  }
} 