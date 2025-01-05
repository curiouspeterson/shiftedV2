/**
 * Authentication Callback Route
 * 
 * Handles authentication callbacks and session management.
 * Sets up cookies for session persistence.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

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
  }
} 