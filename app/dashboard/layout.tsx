import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/serverClient"
import { Sidebar } from "@/components/sidebar"
import ErrorBoundary from "@/components/ErrorBoundary"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Session error:', sessionError)
      redirect('/login')
    }

    if (!session) {
      redirect('/login')
    }

    // Fetch the user's role from the 'profiles' table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      redirect('/login')
    }

    const isManager = profile?.role === 'manager'

    return (
      <div className="flex h-screen">
        <ErrorBoundary>
          {/* Sidebar navigation */}
          <div className="w-64 border-r bg-muted/40 p-6">
            <Sidebar userId={session.user.id} isManager={isManager} />
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-auto p-8">
            {children}
          </div>
        </ErrorBoundary>
      </div>
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    redirect('/login')
  }
}

