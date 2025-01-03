"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { type WeeklySchedule, type ShiftRequirement } from "@/types/schedule"
import { AssignShiftDialog } from "./assign-shift-dialog"

export function WeeklySchedule() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRequirement, setSelectedRequirement] = useState<ShiftRequirement | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedule()
  }, [currentWeekStart])

  const fetchSchedule = async () => {
    setIsLoading(true)
    try {
      const startDate = format(currentWeekStart, "yyyy-MM-dd")
      const endDate = format(endOfWeek(currentWeekStart), "yyyy-MM-dd")

      const { data: requirements, error: requirementsError } = await supabase
        .from("shift_requirements")
        .select("*")
        .order("start_time")

      if (requirementsError) throw requirementsError

      const { data: assignments, error: assignmentsError } = await supabase
        .from("shift_assignments")
        .select("*, employee:profiles(id, full_name)")
        .gte("date", startDate)
        .lte("date", endDate)

      if (assignmentsError) throw assignmentsError

      // Build schedule data structure
      const days: WeeklySchedule["days"] = []
      for (let i = 0; i < 7; i++) {
        const date = format(addDays(currentWeekStart, i), "yyyy-MM-dd")
        const dayOfWeek = i

        const dayRequirements = requirements.filter(
          (req) => req.day_of_week === dayOfWeek
        )

        const shifts = dayRequirements.map((requirement) => {
          const shiftAssignments = assignments.filter(
            (assignment) =>
              assignment.shift_requirement_id === requirement.id &&
              assignment.date === date
          )

          return {
            requirement,
            assignments: shiftAssignments.map((assignment) => ({
              id: assignment.id,
              employee: {
                id: assignment.employee.id,
                full_name: assignment.employee.full_name,
              },
            })),
          }
        })

        days.push({
          date,
          shifts,
        })
      }

      setSchedule({
        startDate,
        endDate,
        days,
      })
    } catch (error) {
      console.error("Error fetching schedule:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load schedule. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1))
  }

  const handleAssignShift = (requirement: ShiftRequirement, date: string) => {
    setSelectedRequirement(requirement)
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  const handleAssignmentSuccess = () => {
    fetchSchedule()
    setIsDialogOpen(false)
    setSelectedRequirement(null)
    setSelectedDate(null)
  }

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-background p-4 rounded-lg border">
        <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          Week of {format(currentWeekStart, "MMM dd, yyyy")}
        </h2>
        <Button variant="outline" size="icon" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {schedule?.days.map((day, index) => (
          <Card key={day.date}>
            <CardContent className="p-4">
              <h3 className="font-bold">{days[index]}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {format(new Date(day.date), "MMM dd")}
              </p>
              <div className="space-y-2">
                {day.shifts.map(({ requirement, assignments }) => (
                  <div key={requirement.id} className="border rounded p-2">
                    <p className="text-sm font-medium">
                      {format(new Date(`1970-01-01T${requirement.start_time}`), "h:mm a")} -{" "}
                      {format(new Date(`1970-01-01T${requirement.end_time}`), "h:mm a")}
                    </p>
                    <div className="mt-1 space-y-1">
                      {assignments.map((assignment) => (
                        <p key={assignment.id} className="text-xs text-muted-foreground">
                          {assignment.employee.full_name}
                        </p>
                      ))}
                      {assignments.length < requirement.required_count && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleAssignShift(requirement, day.date)}
                        >
                          Assign ({requirement.required_count - assignments.length} needed)
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AssignShiftDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        requirement={selectedRequirement}
        date={selectedDate}
        onSuccess={handleAssignmentSuccess}
      />
    </div>
  )
} 