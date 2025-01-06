"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { EmployeeSchedule } from "@/components/employee-schedule"
import { TimeOffRequestsList } from "@/components/time-off-requests-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ScheduleStats {
  totalHours: number
  weeklyHours: number
  pendingShifts: number
  completedShifts: number
}

export interface DashboardContentProps {
  userEmail: string | null
}

export function DashboardContent({ userEmail }: DashboardContentProps) {
  const [stats, setStats] = useState<ScheduleStats>({
    totalHours: 0,
    weeklyHours: 0,
    pendingShifts: 0,
    completedShifts: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Get all shifts for the logged-in user
        const { data: shifts, error } = await supabase
          .from('shifts')
          .select('*')
          .eq('user_email', userEmail)

        if (error) throw error

        // Calculate stats from shifts data
        const now = new Date()
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))

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
            completedShifts: shift.status === 'accepted' 
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

    if (userEmail) {
      fetchStats()
    }
  }, [userEmail])

  return (
    <div className="space-y-6">
      {userEmail && (
        <p className="text-sm text-muted-foreground">
          Logged in as: {userEmail}
        </p>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleCalendar />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time Off Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeOffRequestsList />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeSchedule />
            </CardContent>
          </Card>

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