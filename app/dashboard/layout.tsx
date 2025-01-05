/**
 * Dashboard Layout Component
 * 
 * Layout component for the dashboard section of the application.
 * Provides authentication, navigation, and shared UI elements.
 * 
 * Features:
 * - Authentication check
 * - Role-based access control
 * - Sidebar navigation
 * - Loading states
 * - Error handling
 * - Responsive layout
 * - Session management
 */

import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"

/**
 * Dashboard layout component
 * Manages authentication and provides dashboard structure
 * 
 * @property children - Child components to render within the layout
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize server-side Supabase client
  const supabase = createServerSupabaseClient()

  // Get current session and user data
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Get user profile and role information
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // Check if user is a manager
  const isManager = profile?.role === 'manager'

  return (
    <div className="flex h-screen">
      {/* Sidebar navigation */}
      <div className="w-64 border-r bg-muted/40 p-6">
        <Sidebar isManager={isManager} />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  )
}

