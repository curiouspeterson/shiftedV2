/**
 * Dashboard Main Page Component
 * 
 * Client-side component that serves as the main dashboard view.
 * Displays user information and schedule overview.
 * 
 * Features:
 * - User profile information
 * - Schedule calendar view
 * - Time off requests overview
 * - Availability overview
 * - Responsive grid layout
 */

"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WeeklySchedule } from "@/components/schedule/weekly-schedule"
import { TimeOffRequestsList } from "@/components/time-off-requests-list"
import { AvailabilityList } from "@/components/availability-list"

interface Profile {
  full_name: string
  role: string
  email: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user?.id)
          .single()

        if (profileError) throw profileError
        setProfile(profile)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    getProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {profile?.full_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Role: {profile?.role}
          </p>
          <p className="text-muted-foreground">
            Email: {profile?.email}
          </p>
        </CardContent>
      </Card>
      
      {/* Schedule section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklySchedule />
        </CardContent>
      </Card>

      {/* Time off and availability section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Time Off Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeOffRequestsList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <AvailabilityList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


