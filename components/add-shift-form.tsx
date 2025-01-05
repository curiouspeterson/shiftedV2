/**
 * Add Shift Form Component
 * 
 * Form component for creating new work shifts.
 * Provides an interface for managers to add shift requirements.
 * 
 * Features:
 * - Date selection with calendar
 * - Time range input
 * - Employee count specification
 * - Form validation
 * - Loading states
 * - Success/error notifications
 * - Automatic form reset
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

/**
 * Add shift form component
 * Manages form state and submission for new shifts
 */
export function AddShiftForm() {
  // Form field state management
  const [date, setDate] = useState<Date | undefined>()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [employeeCount, setEmployeeCount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Form submission handler
   * Creates new shift requirement record
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !startTime || !endTime || !employeeCount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()

      // Create shift requirement record
      const { error } = await supabase
        .from('shift_requirements')
        .insert([
          {
            date: date.toISOString().split('T')[0],
            start_time: startTime,
            end_time: endTime,
            employees_required: parseInt(employeeCount)
          }
        ])

      if (error) throw error

      // Show success message
      toast({
        title: "Success",
        description: "Shift requirement added successfully",
      })

      // Reset form
      setDate(undefined)
      setStartTime("")
      setEndTime("")
      setEmployeeCount("")
    } catch (error) {
      console.error('Error adding shift requirement:', error)
      toast({
        title: "Error",
        description: "Failed to add shift requirement",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Shift</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date selection calendar */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()} // Disable past dates
            />
          </div>

          {/* Time range inputs */}
          <div className="grid gap-4 md:grid-cols-2">
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

          {/* Employee count input */}
          <div className="space-y-2">
            <Label htmlFor="employeeCount">Employees Required</Label>
            <Input
              id="employeeCount"
              type="number"
              min="1"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(e.target.value)}
              required
            />
          </div>

          {/* Submit button with loading state */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Shift"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

