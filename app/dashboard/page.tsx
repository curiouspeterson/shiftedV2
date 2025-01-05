/**
 * Dashboard Main Page Component
 * 
 * Client-side component that serves as the main dashboard view.
 * Displays the employee schedule interface and user information.
 * 
 * Features:
 * - User email display for context
 * - Schedule calendar view
 * - Shift management interface
 * - Responsive grid layout
 */

"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { AddShiftForm } from "@/components/add-shift-form"

/**
 * Main dashboard component
 * Provides schedule management interface and user context
 */
export default function DashboardPage() {
  // Track current user's email for display
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    /**
     * Fetches and sets the current user's email
     * Handles error cases by clearing the email state
     */
    const getUserEmail = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUserEmail(user?.email ?? null)
      } catch (error) {
        console.error('Error fetching user:', error)
        setUserEmail(null)
      }
    }
    
    // Fetch user email on component mount
    getUserEmail()
  }, [])

  return (
    <div className="space-y-6">
      {/* Page header with user context */}
      <h1 className="text-3xl font-bold text-gray-900">Employee Schedule</h1>
      {userEmail && <p className="text-gray-600">Logged in as: {userEmail}</p>}
      
      {/* Main content grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Schedule display and management components */}
        <ScheduleCalendar />
        <AddShiftForm />
      </div>
    </div>
  )
}


