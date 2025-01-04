"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { type ShiftRequirement } from "@/types/schedule"

interface ShiftRequirementDialogProps {
  shiftRequirement?: ShiftRequirement
  onClose: () => void
  onSuccess: () => void
}

export function ShiftRequirementDialog({
  shiftRequirement,
  onClose,
  onSuccess,
}: ShiftRequirementDialogProps) {
  const [name, setName] = useState(shiftRequirement?.name || "")
  const [dayOfWeek, setDayOfWeek] = useState<string>(
    shiftRequirement?.day_of_week.toString() || "0"
  )
  const [startTime, setStartTime] = useState(shiftRequirement?.start_time || "09:00")
  const [endTime, setEndTime] = useState(shiftRequirement?.end_time || "17:00")
  const [requiredCount, setRequiredCount] = useState(
    shiftRequirement?.required_count.toString() || "1"
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const data = {
        name,
        day_of_week: parseInt(dayOfWeek),
        start_time: startTime,
        end_time: endTime,
        required_count: parseInt(requiredCount),
      }

      if (shiftRequirement) {
        const { error } = await supabase
          .from("shift_requirements")
          .update(data)
          .eq("id", shiftRequirement.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("shift_requirements").insert([data])
        if (error) throw error
      }

      toast({
        title: "Success",
        description: `Shift requirement ${shiftRequirement ? "updated" : "created"} successfully.`,
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving shift requirement:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save shift requirement. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dayOfWeek">Day of Week</Label>
        <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Sunday</SelectItem>
            <SelectItem value="1">Monday</SelectItem>
            <SelectItem value="2">Tuesday</SelectItem>
            <SelectItem value="3">Wednesday</SelectItem>
            <SelectItem value="4">Thursday</SelectItem>
            <SelectItem value="5">Friday</SelectItem>
            <SelectItem value="6">Saturday</SelectItem>
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
      <div className="space-y-2">
        <Label htmlFor="requiredCount">Required Count</Label>
        <Input
          id="requiredCount"
          type="number"
          min="1"
          value={requiredCount}
          onChange={(e) => setRequiredCount(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : shiftRequirement ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  )
} 