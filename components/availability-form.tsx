"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from '@supabase/ssr'
import { toast } from "@/components/ui/use-toast"

const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" }
]

interface AvailabilityFormProps {
  onAvailabilityAdded: () => void
}

export function AvailabilityForm({ onAvailabilityAdded }: AvailabilityFormProps) {
  const [dayOfWeek, setDayOfWeek] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

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

      <Button type="submit" disabled={isSubmitting || !dayOfWeek || !startTime || !endTime}>
        {isSubmitting ? "Adding..." : "Add Availability"}
      </Button>
    </form>
  )
}