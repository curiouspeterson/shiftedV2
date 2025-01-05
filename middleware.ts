/**
 * Next.js Middleware
 * 
 * Handles authentication and routing middleware for the application.
 * Protects dashboard routes and manages Supabase authentication state.
<<<<<<< HEAD
=======
 * 
 * Features:
 * - Route protection for dashboard pages
 * - Supabase authentication integration
 * - Cookie management for auth state
 * - Logging for debugging
 * - Error handling
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
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
<<<<<<< HEAD
  try {
    console.log('Middleware processing request:', request.url)

    // Create a basic response with minimal headers
    const response = NextResponse.next()

=======
  const response = NextResponse.next()

  try {
    // Initialize Supabase client with cookie handling
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
<<<<<<< HEAD
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
=======
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
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
          },
        },
      }
    )

<<<<<<< HEAD
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
=======
    // Check authentication status
    const { data: { session } } = await supabase.auth.getSession()
    
    // Log authentication state for debugging
    console.log('Middleware auth check:', {
      path: request.nextUrl.pathname,
      hasSession: !!session,
      user: session?.user?.email
    })

    // Protect dashboard routes - redirect to login if not authenticated
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

  } catch (e) {
    // Log any errors that occur during middleware execution
    console.error('Middleware error:', e)
  }
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589

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

/**
 * Middleware configuration
 * Defines which routes the middleware should run on
 * Excludes static files and assets
 */
export const config = {
  matcher: [
<<<<<<< HEAD
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
=======
    '/((?!_next/static|_next/image|favicon.ico).*)',
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
  ],
} 