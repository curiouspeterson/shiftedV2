/**
 * Dashboard Main Page Component
 * 
 * Server component that handles authentication and serves as the main dashboard view.
 * Displays the employee schedule interface and user information.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardContent } from './dashboard-content'
import { type Database } from '@/types/supabase'

export default async function DashboardPage() {
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
  
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Employee Schedule</h1>
      <DashboardContent />
    </div>
  )
}

// Move DashboardContent to a separate file: app/dashboard/dashboard-content.tsx


