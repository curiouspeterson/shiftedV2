/**
 * Weekly Schedule Component
 * 
 * A comprehensive component for displaying and managing weekly shift schedules.
 * This component provides:
 * - Weekly calendar view with day-by-day shift display
 * - Shift requirement management
 * - Employee assignment tracking
 * - Week navigation controls
 * - Integration with AssignShiftDialog for new assignments
 * 
 * The component uses Supabase for data operations and shadcn/ui
 * components for the user interface. It manages both shift requirements
 * and actual shift assignments in a weekly calendar format.
 */

"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { type WeeklySchedule, type ShiftRequirement, type ShiftAssignment } from "@/types/schedule"
import { AssignShiftDialog } from "./assign-shift-dialog"

// Extended interface for shift assignments with profile and requirement details
interface ScheduleAssignment extends ShiftAssignment {
  profile: {
    full_name: string
  }
  shift_requirement: ShiftRequirement
}

export function WeeklySchedule() {
  // State management for schedule data and UI controls
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [schedule, setSchedule] = useState<WeeklySchedule>({})
  const [requirements, setRequirements] = useState<ShiftRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequirement, setSelectedRequirement] = useState<ShiftRequirement | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Fetch schedule and requirements when week changes
  useEffect(() => {
    fetchSchedule()
    fetchRequirements()
  }, [weekStart])

  /**
   * Fetches shift assignments for the current week
   * Includes profile and shift requirement details
   * Groups assignments by date for easy display
   */
  const fetchSchedule = async () => {
    try {
      const supabase = createClient()
      const { data: assignments, error } = await supabase
        .from('shifts')
        .select(`
          *,
          profile:profiles(full_name),
          shift_requirement:shift_requirements(*)
        `)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(addDays(weekStart, 6), 'yyyy-MM-dd'))
        .order('date')
        .order('start_time')

      if (error) throw error

      // Group assignments by date for calendar display
      const groupedSchedule: WeeklySchedule = {}
      assignments?.forEach((assignment: ScheduleAssignment) => {
        const date = assignment.date
        if (!groupedSchedule[date]) {
          groupedSchedule[date] = []
        }
        groupedSchedule[date].push({
          ...assignment,
          employee_name: assignment.profile.full_name,
        })
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
   * Fetches shift requirements from the database
   * Orders them by day of week and start time
   */
  const fetchRequirements = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('shift_requirements')
        .select('*')
        .order('day_of_week')
        .order('start_time')

      if (error) throw error
      setRequirements(data || [])
    } catch (error) {
      console.error('Error fetching requirements:', error)
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
   * Navigation handlers for week selection
   */
  const handlePreviousWeek = () => {
    setWeekStart(prev => addDays(prev, -7))
  }

  const handleNextWeek = () => {
    setWeekStart(prev => addDays(prev, 7))
  }

  /**
   * Utility function to format time strings for display
   */
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Render weekly calendar view
  return (
    <div className="space-y-4">
      {/* Week navigation header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          Week of {format(weekStart, 'MMMM d, yyyy')}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekly calendar grid */}
      <div className="grid gap-4 md:grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => {
          const date = addDays(weekStart, i)
          const dateStr = format(date, 'yyyy-MM-dd')
          // Filter requirements for current day
          const dayRequirements = requirements.filter(
            req => req.day_of_week === date.getDay()
          )

          return (
            <Card key={dateStr}>
              <CardContent className="p-4">
                {/* Day header */}
                <h3 className="font-medium">{format(date, 'EEEE')}</h3>
                <p className="text-sm text-gray-500">{format(date, 'MMM d')}</p>
                {/* Shift requirements and assignments */}
                <div className="mt-4 space-y-2">
                  {dayRequirements.map(req => {
                    // Get assignments for this requirement
                    const assignedEmployees = schedule[dateStr]?.filter(
                      shift => shift.shift_requirement_id === req.id
                    ) || []

                    return (
                      <div
                        key={req.id}
                        className="rounded-lg border p-2 text-sm"
                        role="button"
                        onClick={() => {
                          setSelectedRequirement(req)
                          setSelectedDate(dateStr)
                        }}
                      >
                        <p className="font-medium">
                          {req.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTime(req.start_time)} - {formatTime(req.end_time)}
                        </p>
                        {/* Employee assignments */}
                        <div className="mt-1 space-y-1">
                          {assignedEmployees.map(assignment => (
                            <p key={assignment.id} className="text-gray-500">
                              {assignment.employee_name}
                            </p>
                          ))}
                          {/* Staffing needs indicator */}
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
          )
        })}
      </div>

      {/* Assignment dialog */}
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