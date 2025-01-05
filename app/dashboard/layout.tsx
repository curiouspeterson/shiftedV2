/**
 * Dashboard Layout Component
 */

import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"

async function getDashboardLayout() {
  const supabase = createServerSupabaseClient()
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      redirect('/login')
    }

    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const isManager = profile?.role === 'manager'

    return { session, isManager }
  } catch (error) {
    console.error('Dashboard layout error:', error)
    redirect('/login')
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, isManager } = await getDashboardLayout()

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r bg-card p-6">
          <Sidebar isManager={isManager} />
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

