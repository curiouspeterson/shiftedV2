/**
 * Employee Schedule Component
 * 
 * A component for displaying and managing an individual employee's shift schedule.
 * This component provides:
 * - Display of upcoming shifts for the current week
 * - Shift status management (accept/reject)
 * - Shift details including times and requirements
 * - Loading and empty states
 * - Real-time updates
 * 
 * The component uses Supabase for data operations and shadcn/ui
 * components for the user interface. It focuses on the current
 * week's schedule and allows employees to manage their shifts.
 */

"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { format, parseISO, startOfWeek, endOfWeek } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

// Interface for shift data including requirement details
interface Shift {
  id: string
  profile_id: string
  shift_requirement_id: string
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  shift_requirement?: {
    name: string
  }
}

export function EmployeeSchedule() {
  // State management for shifts and loading
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch shifts on component mount
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        // Calculate date range for current week
        const startDate = startOfWeek(new Date())
        const endDate = endOfWeek(new Date())

        // Fetch shifts with requirement details
        const { data, error } = await supabase
          .from('shifts')
          .select(`
            *,
            shift_requirement:shift_requirements (
              name
            )
          `)
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0])
          .order('date', { ascending: true })

        if (error) throw error
        setShifts(data || [])
      } catch (error) {
        console.error('Error fetching shifts:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load shifts",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchShifts()
  }, [])

  /**
   * Handles updating the status of a shift
   * Supports accepting or rejecting shifts
   * Updates local state and database
   */
  const handleStatusChange = async (shiftId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Update shift status in database
      const { error } = await supabase
        .from('shifts')
        .update({ status: newStatus })
        .eq('id', shiftId)

      if (error) throw error

      // Update local state
      setShifts(shifts.map(shift => 
        shift.id === shiftId ? { ...shift, status: newStatus } : shift
      ))

      toast({
        title: "Success",
        description: `Shift ${newStatus} successfully`,
      })
    } catch (error) {
      console.error('Error updating shift status:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update shift status",
      })
    }
  }

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Show message when no shifts are scheduled
  if (shifts.length === 0) {
    return <p className="text-sm text-muted-foreground">No upcoming shifts scheduled</p>
  }

  // Render list of shifts with actions
  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <div
          key={shift.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          {/* Shift details section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">
                {format(parseISO(shift.date), 'EEEE, MMMM d')}
              </p>
              <Badge
                variant={
                  shift.status === 'accepted'
                    ? 'secondary'
                    : shift.status === 'rejected'
                    ? 'destructive'
                    : 'default'
                }
              >
                {shift.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {shift.shift_requirement?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(parseISO(`2000-01-01T${shift.start_time}`), 'h:mm a')} -{' '}
              {format(parseISO(`2000-01-01T${shift.end_time}`), 'h:mm a')}
            </p>
          </div>
          
          {/* Action buttons for pending shifts */}
          {shift.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(shift.id, 'accepted')}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => handleStatusChange(shift.id, 'rejected')}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

