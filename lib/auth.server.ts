import { Database } from '@/types/supabase'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Higher-order function to protect routes that require manager authentication.
 * Verifies both user authentication and manager role before allowing access.
 * 
 * @param handler - The route handler to protect.
 * @returns Protected route handler that first validates manager authentication.
 */
export function withManagerAuth(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      console.log('1. Starting withManagerAuth middleware')
      console.log('   Method:', req.method)
      console.log('   URL:', req.url)
      
      // Get current user from the request cookies
      console.log('2. Getting current user from cookies')
      const cookieStore = cookies()
      const allCookies = cookieStore.getAll()
      console.log('   Available cookies:', allCookies.map(c => c.name))
      
      const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              const value = cookieStore.get(name)?.value
              console.log('   Cookie requested:', name, 'Found:', !!value)
              return value
            },
          },
        }
      )
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('3. Session check:')
      console.log('   Session found:', !!session)
      console.log('   User ID:', session?.user?.id)
      
      if (sessionError) {
        console.error('   Session error:', sessionError)
        throw sessionError
      }
      
      if (!session?.user) {
        console.log('   No session found')
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      console.log('4. Checking user role')
      // Check if user is a manager
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      console.log('   Profile found:', !!profile)
      console.log('   Role:', profile?.role)
      
      if (profileError) {
        console.error('   Profile error:', profileError)
        throw profileError
      }
      
      if (!profile || profile.role !== 'manager') {
        console.log('   User is not a manager')
        return NextResponse.json(
          { error: 'Forbidden - Manager access required' },
          { status: 403 }
        )
      }
      
      console.log('5. Authorization successful, calling handler')
      const response = await handler(req)
      console.log('6. Handler completed')
      console.log('   Response status:', response.status)
      return response
    } catch (error: any) {
      console.error('Error in withManagerAuth:', error)
      return NextResponse.json(
        { error: error.message || 'Authorization failed' },
        { status: 500 }
      )
    }
  }
} 