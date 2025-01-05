/**
 * Employee Availability Manager Component
 * 
 * A component for managing individual employee availability settings.
 * Provides an interface for viewing and modifying employee availability slots.
 * 
 * Features:
 * - Employee-specific availability management
 * - Availability slot viewing
 * - Slot modification
 * - Real-time updates
 * - Loading states
 * - Error handling
 */

"use client"

import { useState, useEffect } from 'react'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Days of week options for selection
 */
const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" }
]

/**
 * Availability slot interface
 */
interface AvailabilitySlot {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

/**
 * Component props
 */
interface EmployeeAvailabilityManagerProps {
  employeeId: string
}

/**
 * Employee availability manager component
 */
export function EmployeeAvailabilityManager({ employeeId }: EmployeeAvailabilityManagerProps) {
  // State management
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dayOfWeek, setDayOfWeek] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch availability slots on mount
  useEffect(() => {
    fetchAvailability()
  }, [employeeId])

  /**
   * Fetches availability slots for the employee
   */
  const fetchAvailability = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('employee_availability')
        .select('*')
        .eq('profile_id', employeeId)
        .order('day_of_week')

      if (error) throw error
      setSlots(data || [])
    } catch (error) {
      console.error('Error fetching availability:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch availability slots",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles form submission to add new availability slot
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('employee_availability')
        .insert([
          {
            profile_id: employeeId,
            day_of_week: parseInt(dayOfWeek),
            start_time: startTime,
            end_time: endTime
          }
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Availability slot added successfully",
      })

      // Reset form and refresh slots
      setDayOfWeek("")
      setStartTime("")
      setEndTime("")
      fetchAvailability()
    } catch (error) {
      console.error('Error adding availability:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add availability slot",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handles deletion of an availability slot
   */
  const handleDelete = async (slotId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('employee_availability')
        .delete()
        .eq('id', slotId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Availability slot deleted successfully",
      })
      fetchAvailability()
    } catch (error) {
      console.error('Error deleting availability:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete availability slot",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Add availability form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Availability Slot</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Day of week selection */}
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Day of Week</Label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time range inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <Button type="submit" disabled={isSubmitting || !dayOfWeek || !startTime || !endTime}>
              {isSubmitting ? "Adding..." : "Add Availability"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current availability slots */}
      <Card>
        <CardHeader>
          <CardTitle>Current Availability</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading availability slots...</div>
          ) : slots.length === 0 ? (
            <div>No availability slots set</div>
          ) : (
            <div className="space-y-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">
                      {DAYS_OF_WEEK.find(day => day.value === slot.day_of_week.toString())?.label}
                    </p>
                    <p className="text-sm text-gray-500">
                      {slot.start_time} - {slot.end_time}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(slot.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

