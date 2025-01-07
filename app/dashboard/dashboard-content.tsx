"use client"

/**
 * Dashboard Content Component
 * 
 * Main dashboard component that displays employee schedule information and statistics.
 * This component provides:
 * - Schedule overview with calendar
 * - Time off request management
 * - Upcoming shifts display
 * - Schedule statistics (hours, shifts)
 * 
 * The component uses Supabase for data operations and integrates multiple
 * sub-components to create a comprehensive dashboard view.
 */

import * as React from "react"
import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { EmployeeSchedule } from "@/components/employee-schedule"
import { TimeOffRequestsList } from "@/components/time-off-requests-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Interface for schedule statistics
interface ScheduleStats {
  totalHours: number      // Total hours scheduled
  weeklyHours: number     // Hours scheduled for current week
  pendingShifts: number   // Number of pending shift assignments
  completedShifts: number // Number of completed shifts
}

export function DashboardContent() {
  // State management for statistics and loading
  const [stats, setStats] = useState<ScheduleStats>({
    totalHours: 0,
    weeklyHours: 0,
    pendingShifts: 0,
    completedShifts: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch statistics on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error('No user found')

        // Get all shifts for the logged-in user with requirement details
        const { data: shifts, error } = await supabase
          .from('shifts')
          .select(`
            *,
            shift_requirement:shift_requirements (
              name
            )
          `)
          .eq('profile_id', user.id)

        if (error) throw error

        // Calculate date range for current week
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)
        
        const endOfWeek = new Date(now)
        endOfWeek.setDate(now.getDate() - now.getDay() + 6)
        endOfWeek.setHours(23, 59, 59, 999)

        // Calculate statistics from shift data
        const calculatedStats = shifts?.reduce((acc, shift) => {
          const shiftDate = new Date(shift.date)
          const startTime = new Date(`${shift.date}T${shift.start_time}`)
          const endTime = new Date(`${shift.date}T${shift.end_time}`)
          const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

          return {
            totalHours: acc.totalHours + hours,
            weeklyHours: shiftDate >= startOfWeek && shiftDate <= endOfWeek 
              ? acc.weeklyHours + hours 
              : acc.weeklyHours,
            pendingShifts: shift.status === 'pending' 
              ? acc.pendingShifts + 1 
              : acc.pendingShifts,
            completedShifts: shift.status === 'completed' 
              ? acc.completedShifts + 1 
              : acc.completedShifts
          }
        }, {
          totalHours: 0,
          weeklyHours: 0,
          pendingShifts: 0,
          completedShifts: 0
        }) || {
          totalHours: 0,
          weeklyHours: 0,
          pendingShifts: 0,
          completedShifts: 0
        }

        setStats(calculatedStats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left column - Schedule and Time Off */}
        <div className="space-y-6">
          {/* Schedule Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleCalendar />
            </CardContent>
          </Card>

          {/* Time Off Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Time Off Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeOffRequestsList />
            </CardContent>
          </Card>
        </div>

        {/* Right column - Upcoming Shifts and Stats */}
        <div className="space-y-6">
          {/* Upcoming Shifts */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeSchedule />
            </CardContent>
          </Card>

          {/* Schedule Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{stats.weeklyHours.toFixed(1)}h</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Pending Shifts</p>
                  <p className="text-2xl font-bold">{stats.pendingShifts}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Completed Shifts</p>
                  <p className="text-2xl font-bold">{stats.completedShifts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 