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

  return response
}

/**
 * Middleware configuration
 * Defines which routes the middleware should run on
 * Excludes static files and assets
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 