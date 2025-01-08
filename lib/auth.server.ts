/**
 * Server-side Authentication Utility Module
 * 
 * This module provides server-side authentication functionality using Supabase,
 * including route protection and manager access control.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { type Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Higher-order function to protect routes that require manager authentication.
 * 
 * @param handler - The route handler to protect.
 * @returns Protected route handler that first validates manager authentication.
 */
export function withManagerAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const cookieStore = cookies()

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: CookieOptions) => {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle cookie error in development
              console.error('Cookie error:', error)
            }
          },
          remove: (name: string, options: CookieOptions) => {
            try {
              cookieStore.delete({ name, ...options })
            } catch (error) {
              // Handle cookie error in development
              console.error('Cookie error:', error)
            }
          }
        }
      }
    )

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Case-insensitive manager role check
    const isManager = (profile as Profile).role?.toLowerCase() === 'manager' || 
                     (profile as Profile).role?.toLowerCase() === 'admin'

    if (!isManager) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return handler(req)
  }
} 