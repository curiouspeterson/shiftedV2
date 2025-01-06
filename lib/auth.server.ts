/**
 * Server-side Authentication Utility Module
 * 
 * This module provides server-side authentication functionality using Supabase,
 * including route protection and manager access control.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { type Database } from '@/types/supabase'

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
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: { path: string }) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // Handle cookie error in development
            }
          },
          remove(name: string, options: { path: string }) {
            try {
              cookieStore.delete(name)
            } catch (error) {
              // Handle cookie error in development
            }
          },
        },
      }
    )

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return handler(req)
  }
} 