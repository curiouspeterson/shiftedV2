/**
 * Shifts Page Component
 * 
 * Main page component for managing shift requirements.
 * Provides an interface for viewing and managing recurring shift schedules.
 * 
 * Features:
 * - Shift requirements management
 * - Page metadata
 * - Responsive layout
 * - SEO optimization
 */

"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ShiftRequirements } from "./components/shift-requirements"

/**
 * Shifts management page component
 * Renders the shift requirements interface
 */
export default function ShiftsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkManagerRole() {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) {
          router.push('/login')
          return
        }

        // Check if user is a manager
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        if (!profile || profile.role !== 'manager') {
          router.push('/dashboard')
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error checking manager role:', error)
        router.push('/dashboard')
      }
    }

    checkManagerRole()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Page header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Shift Requirements</h2>
      </div>
      {/* Shift requirements component */}
      <ShiftRequirements />
    </div>
  )
}