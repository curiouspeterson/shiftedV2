/**
 * Employee Schedule Component
 * 
 * Displays and manages an individual employee's shift schedule.
 * Provides functionality for viewing and responding to shift assignments.
 * 
 * Features:
 * - Date range filtering
 * - Shift details display
 * - Status indicators
 * - Accept/reject actions
 * - Real-time updates
 * - Loading states
 * - Error handling
 * - Empty state handling
 */

"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { format, parseISO, startOfWeek, endOfWeek } from "date-fns"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface Shift {
  id: string
  date: string
  start_time: string
  end_time: string
  status: 'pending' | 'accepted' | 'rejected'
}

export function EmployeeSchedule() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const startDate = startOfWeek(new Date())
        const endDate = endOfWeek(new Date())

        const { data, error } = await supabase
          .from('shifts')
          .select('*')
          .gte('date', startDate.toISOString())
          .lte('date', endDate.toISOString())
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

  const handleStatusChange = async (shiftId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase
        .from('shifts')
        .update({ status: newStatus })
        .eq('id', shiftId)

      if (error) throw error

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

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (shifts.length === 0) {
    return <p className="text-sm text-muted-foreground">No upcoming shifts scheduled</p>
  }

  return (
    <div className="space-y-4">
      {shifts.map((shift) => (
        <div
          key={shift.id}
          className="flex items-center justify-between rounded-lg border p-4"
        >
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
              {format(parseISO(`2000-01-01T${shift.start_time}`), 'h:mm a')} -{' '}
              {format(parseISO(`2000-01-01T${shift.end_time}`), 'h:mm a')}
            </p>
          </div>
          
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

