/**
 * Next.js Middleware
 * 
 * Handles authentication and routing middleware for the application.
 * Protects dashboard routes and manages Supabase authentication state.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    console.log('Middleware processing request:', request.url)

    // Create a basic response with minimal headers
    const response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
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

    // Get session without refreshing to avoid unnecessary cookie updates
    const { data: { session } } = await supabase.auth.getSession()

    const path = request.nextUrl.pathname

    // Skip middleware for static files and API routes
    if (
      path.startsWith('/_next') ||
      path.startsWith('/api') ||
      path.includes('.')
    ) {
      return response
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
      if (path.startsWith('/dashboard/shifts')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (!profile || profile.role !== 'manager') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // Return a basic response on error to avoid header issues
    return NextResponse.next()
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
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 