"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek, parse } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { type WeeklySchedule, type ShiftRequirement, type ShiftAssignment } from "@/types/schedule"
import { AssignShiftDialog } from "./assign-shift-dialog"
import Link from "next/link"

/**
 * Extended shift assignment interface with profile information
 * @property profile - Employee profile information
 */
interface ScheduleAssignment extends ShiftAssignment {
  profile: {
    full_name: string | null
  }
}

/**
 * Weekly schedule management component
 * Handles display and management of weekly shift schedules
 */
export function WeeklySchedule() {
  // State management
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [schedule, setSchedule] = useState<WeeklyScheduleType>({})
  const [shiftRequirements, setShiftRequirements] = useState<ShiftRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequirement, setSelectedRequirement] = useState<ShiftRequirement | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Fetch schedule and requirements on week change
  useEffect(() => {
    fetchSchedule()
  }, [weekStart])

  /**
   * Fetches shift assignments for the current week
   * Groups assignments by date
   */
  const fetchSchedule = async () => {
    try {
      const supabase = createClient()
      const { data: assignments, error } = await supabase
        .from('shift_assignments')
        .select('*, profile:profiles(full_name)')
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(addDays(weekStart, 6), 'yyyy-MM-dd'))

      if (error) throw error

      // Group assignments by date
      const groupedSchedule: WeeklyScheduleType = {}
      assignments?.forEach((assignment) => {
        const date = assignment.date
        if (!groupedSchedule[date]) {
          groupedSchedule[date] = []
        }
        groupedSchedule[date].push(assignment as ShiftAssignmentWithProfile)
      })

      setSchedule(groupedSchedule)
    } catch (error) {
      console.error('Error fetching schedule:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch schedule",
      })
    }
  }

  /**
   * Fetches shift requirements
   * Orders by day of week and start time
   */
  const fetchRequirements = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('shift_requirements')
        .select()
        .order('day_of_week')
        .order('start_time')

      if (error) throw error
      setShiftRequirements(data || [])
    } catch (error) {
      console.error('Error fetching shift requirements:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch shift requirements",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Navigates to the previous week
   */
  const handlePreviousWeek = () => {
    setWeekStart(prev => addDays(prev, -7))
  }

  /**
   * Navigates to the next week
   */
  const handleNextWeek = () => {
    setWeekStart(prev => addDays(prev, 7))
  }

  /**
   * Formats time string to readable format
   * @param time - Time string in HH:MM format
   * @returns Formatted time string
   */
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Week navigation header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            Week of {format(weekStart, 'MMMM d, yyyy')}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekly calendar grid */}
      <div className="grid gap-4 md:grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => {
          const date = addDays(weekStart, i)
          const dateStr = format(date, 'yyyy-MM-dd')
          const dayRequirements = requirements.filter(
            req => req.day_of_week === date.getDay()
          )

          return (
            <Link key={dateStr} href={`/dashboard/schedule/${dateStr}`}>
              <Card className="h-full transition-colors hover:bg-accent/50">
                <CardContent className="p-4">
                  <h3 className="font-medium">{format(date, 'EEEE')}</h3>
                  <p className="text-sm text-gray-500">{format(date, 'MMM d')}</p>
                  <div className="mt-4 space-y-2">
                    {dayRequirements.map(req => {
                      const assignedEmployees = schedule[dateStr]?.filter(
                        shift => shift.shift_requirement_id === req.id
                      ) || []

                      return (
                        <div
                          key={req.id}
                          className="rounded-lg border p-2 text-sm"
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedRequirement(req)
                            setSelectedDate(dateStr)
                          }}
                        >
                          <p className="font-medium">
                            {formatTime(req.start_time)} - {formatTime(req.end_time)}
                          </p>
                          <div className="mt-1 space-y-1">
                            {assignedEmployees.map(assignment => (
                              <p key={assignment.id} className="text-gray-500">
                                {assignment.employee_name}
                              </p>
                            ))}
                            {assignedEmployees.length < req.required_count && (
                              <p className="text-yellow-500">
                                Need {req.required_count - assignedEmployees.length} more
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Shift assignment dialog */}
      {selectedRequirement && selectedDate && (
        <AssignShiftDialog
          open={true}
          onOpenChange={() => {
            setSelectedRequirement(null)
            setSelectedDate(null)
          }}
          shiftRequirement={selectedRequirement}
          date={selectedDate}
          onSuccess={fetchSchedule}
        />
      )}
    </div>
  )
} 