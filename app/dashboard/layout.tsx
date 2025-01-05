/**
 * Dashboard Layout Component
<<<<<<< HEAD
=======
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
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
 */

import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/sidebar"

<<<<<<< HEAD
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

=======
/**
 * Dashboard layout component
 * Manages authentication and provides dashboard structure
 * 
 * @property children - Child components to render within the layout
 */
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
      </div>
    </div>
  )
}

