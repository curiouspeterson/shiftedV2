/**
 * Next.js Middleware
 * 
 * Handles authentication and routing middleware for the application.
 * Protects dashboard routes and manages Supabase authentication state.
 * 
 * Features:
 * - Route protection for dashboard pages
 * - Supabase authentication integration
 * - Cookie management for auth state
 * - Logging for debugging
 * - Error handling
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware function that runs before page rendering
 * Handles authentication checks and route protection
 * 
 * @param request - The incoming Next.js request
 * @returns NextResponse with appropriate routing/auth handling
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  try {
    // Initialize Supabase client with cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // Get cookie value from request
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          // Set cookie in both request and response
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          // Remove cookie from both request and response
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession()
    
    // Log authentication state for debugging
    console.log('Middleware auth check:', {
      path: request.nextUrl.pathname,
      hasSession: !!session,
      user: session?.user?.email
    })

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
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }

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

/**
 * Middleware configuration
 * Defines which routes the middleware should run on
 * Excludes static files and assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     * - Image file extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
