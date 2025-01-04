import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const cookieStore = cookies()

    if (code) {
      const supabase = createServerClient(
        'https://wgpehvclyqlyhseqdmqj.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndncGVodmNseXFseWhzZXFkbXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NDI5MzksImV4cCI6MjA1MTUxODkzOX0.owN6sfxK_IPPeGqqhA-bvegoM9U5d_uPKBJMe4YBsys',
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.delete(name)
            },
          },
        }
      )

      await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url))
  }
} 