/**
 * Availability Form Component
 * 
 * Form component for adding employee availability time slots.
 * Allows employees to specify their available hours for each day of the week.
 * 
 * Features:
 * - Day of week selection
 * - Time range input
 * - Form validation
 * - Real-time feedback
 * - Success/error notifications
 * - Automatic form reset
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from '@supabase/ssr'
import { toast } from "@/components/ui/use-toast"

/**
 * Days of week options for selection
 * Maps numeric values to day names
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
 * Component props
 * @property onAvailabilityAdded - Callback function triggered after successful submission
 */
interface AvailabilityFormProps {
  onAvailabilityAdded: () => void
}

/**
 * Availability form component
 * Manages form state and submission for availability slots
 */
export function AvailabilityForm({ onAvailabilityAdded }: AvailabilityFormProps) {
  // Form field state management
  const [dayOfWeek, setDayOfWeek] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Form submission handler
   * Creates new availability record in the database
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Initialize Supabase client
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      // Insert availability record
      const { error } = await supabase
        .from('employee_availability')
        .insert([
          {
            profile_id: user.id,
            day_of_week: parseInt(dayOfWeek),
            start_time: startTime,
            end_time: endTime
          }
        ])

      if (error) throw error

      // Show success message
      toast({
        title: "Success",
        description: "Availability added successfully",
      })

      // Reset form
      setDayOfWeek("")
      setStartTime("")
      setEndTime("")
      
      // Notify parent component
      onAvailabilityAdded()
    } catch (error) {
      // Handle and display errors
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add availability",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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

      {/* Start time input */}
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

      {/* End time input */}
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

      {/* Submit button with loading and validation states */}
      <Button type="submit" disabled={isSubmitting || !dayOfWeek || !startTime || !endTime}>
        {isSubmitting ? "Adding..." : "Add Availability"}
      </Button>
    </form>
  )
}