"use client"

import { useState } from "react"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ShiftAssignment {
  id: string
  employeeId: string
  employeeName: string
  startTime: string
  endTime: string
  position: string
}

interface CoverageRequirement {
  id: string
  startTime: string
  endTime: string
  requiredCount: number
  position: string
}

interface DaySchedule {
  date: Date
  coverageRequirements: CoverageRequirement[]
  shiftAssignments: ShiftAssignment[]
}

export default function SchedulePage() {
  const [selectedWeek, setSelectedWeek] = useState(new Date())

  const handlePreviousWeek = () => {
    setSelectedWeek(prev => subWeeks(prev, 1))
  }

  const handleNextWeek = () => {
    setSelectedWeek(prev => addWeeks(prev, 1))
  }

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 0 })

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Schedule Management</h1>
        <Button>Create Schedule</Button>
      </div>

      {/* Week Selection */}
      <div className="flex items-center justify-between bg-background p-4 rounded-lg border">
        <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          Week of {format(weekStart, "MMM dd, yyyy")}
        </h2>
        <Button variant="outline" size="icon" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Daily Schedules */}
      <div className="space-y-6">
        {Array.from({ length: 7 }).map((_, index) => {
          const day = addWeeks(weekStart, 0)
          day.setDate(weekStart.getDate() + index)
          
          return (
            <Card key={day.toISOString()}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Day Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">
                      {format(day, "EEEE, MMMM dd")}
                    </h3>
                    <Button variant="outline">Edit</Button>
                  </div>

                  {/* Coverage Requirements */}
                  <div>
                    <h4 className="font-medium mb-2">Coverage Requirements</h4>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-4 text-sm text-gray-500">
                        <span>Time</span>
                        <span>Position</span>
                        <span>Required</span>
                        <span>Assigned</span>
                      </div>
                      {/* Example coverage requirement */}
                      <div className="grid grid-cols-4 text-sm">
                        <span>7:00 AM - 3:00 PM</span>
                        <span>Barista</span>
                        <span>2</span>
                        <span>1/2</span>
                      </div>
                    </div>
                  </div>

                  {/* Shift Assignments */}
                  <div>
                    <h4 className="font-medium mb-2">Shift Assignments</h4>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-4 text-sm text-gray-500">
                        <span>Employee</span>
                        <span>Position</span>
                        <span>Time</span>
                        <span>Actions</span>
                      </div>
                      {/* Example shift assignment */}
                      <div className="grid grid-cols-4 text-sm">
                        <span>John Doe</span>
                        <span>Barista</span>
                        <span>7:00 AM - 3:00 PM</span>
                        <Button variant="ghost" size="sm">
                          Reassign
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 