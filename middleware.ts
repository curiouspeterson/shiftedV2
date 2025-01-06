/**
 * Next.js Middleware
 * 
 * Handles authentication and routing middleware for the application.
 * Protects dashboard routes and manages Supabase authentication state.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const path = request.nextUrl.pathname

  // Skip middleware for static files and API routes
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.includes('.')
  ) {
    return NextResponse.next()
  }

  try {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.delete({
              name,
              ...options,
            })
          },
        },
      }
    )

    // Get session without refreshing to avoid unnecessary token refreshes
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Handle auth redirects
    if (path === '/login' || path === '/signup') {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } else if (path.startsWith('/dashboard')) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Check manager role for protected routes
      if (path.startsWith('/dashboard/shifts') || path.startsWith('/dashboard/employees')) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profileError || !profile || profile.role !== 'manager') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
