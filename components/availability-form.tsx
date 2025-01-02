"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

export function AvailabilityForm({ onAvailabilityAdded }) {
  const [dayOfWeek, setDayOfWeek] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('employee_availability')
        .insert([
          { 
            user_id: (await supabase.auth.getUser()).data.user?.id,
            day_of_week: parseInt(dayOfWeek),
            start_time: startTime,
            end_time: endTime
          }
        ])
      
      if (error) throw error
      
      setDayOfWeek("")
      setStartTime("")
      setEndTime("")
      onAvailabilityAdded()
    } catch (error) {
      console.error('Error adding availability:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="dayOfWeek">Day of Week</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Add Availability</Button>
        </form>
      </CardContent>
    </Card>
  )
}

