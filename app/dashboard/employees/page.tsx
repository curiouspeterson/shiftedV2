/**
 * Employees Page Component
 * 
 * Main page for managing employee information.
 * Provides employee listing and management functionality.
 * 
 * Features:
 * - Authentication check
 * - Manager role verification
 * - Database connection test
 * - Employee list display
 * - Loading states
 * - Error handling
 * - Retry functionality
 * - Session management
 */

"use client"

import { useEffect, useState } from "react"
import { EmployeesList } from "./components/employees-list"
import { testConnection } from "@/lib/supabase/test-connection"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/providers/supabase-provider"

/**
 * Employees page component
 * Manages employee data display and authentication
 * 
 * Features:
 * - Session verification
 * - Manager role verification
 * - Database connectivity check
 * - Error state handling
 * - Loading state display
 * - Automatic redirection
 */
export default function EmployeesPage() {
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { supabase } = useSupabase()

  /**
   * Checks authentication and manager role
   * Redirects to login if no session found or dashboard if not a manager
   * 
   * @returns void
   * @throws Error if connection test fails
   */
  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('Checking auth...')
        
        // Verify user session
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          console.log('No session found, redirecting to login')
          router.push('/login')
          return
        }

        // Log session details for debugging
        console.log('Session found:', {
          userId: session.user.id,
          email: session.user.email
        })

        // Check if user is a manager
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        // Case-insensitive manager role check
        const isManager = profile?.role?.toLowerCase() === 'manager' || 
                        profile?.role?.toLowerCase() === 'admin'

        if (!isManager) {
          console.log('User is not a manager, redirecting to dashboard')
          router.push('/dashboard')
          return
        }

        // Test database connection
        const connectionResult = await testConnection(supabase)
        console.log('Connection test result:', connectionResult)
        
        if (!connectionResult) {
          setError('Failed to connect to database')
        }
      } catch (err) {
        console.error('Error in auth check:', err)
        setError('Unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-2 text-blue-500 hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
      </div>

      {/* Employee list component */}
      <EmployeesList />
    </div>
  )
}