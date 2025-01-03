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

interface ScheduleAssignment extends ShiftAssignment {
  profile: {
    full_name: string
  }
}

export function WeeklySchedule() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [schedule, setSchedule] = useState<WeeklySchedule>({})
  const [requirements, setRequirements] = useState<ShiftRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequirement, setSelectedRequirement] = useState<ShiftRequirement | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedule()
    fetchRequirements()
  }, [weekStart])

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

  const handlePreviousWeek = () => {
    setWeekStart(prev => addDays(prev, -7))
  }

  const handleNextWeek = () => {
    setWeekStart(prev => addDays(prev, 7))
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
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

      <div className="grid gap-4 md:grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => {
          const date = addDays(weekStart, i)
          const dateStr = format(date, 'yyyy-MM-dd')
          const dayRequirements = requirements.filter(
            req => req.day_of_week === date.getDay()
          )

          return (
            <Card key={dateStr}>
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
                        role="button"
                        onClick={() => {
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
          )
        })}
      </div>

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