/**
 * Dashboard Layout Component
 * 
 * Provides the layout structure for all dashboard pages.
 * Includes sidebar navigation and handles authentication.
 * Created: 2024-01-08
 * Updated: 2024-01-08 - Fixed manager role check
 */

import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize Supabase client
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user's profile to check if they're a manager
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // Check if role is Manager or Admin (case-insensitive)
  const isManager = profile?.role?.toLowerCase() === 'manager' || 
                   profile?.role?.toLowerCase() === 'admin'

  console.log('User role:', profile?.role, 'Is manager:', isManager)

  return (
    <div className="flex h-screen">
      <Sidebar 
        className="w-64 border-r" 
        userId={session.user.id}
        isManager={isManager}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  )
}

