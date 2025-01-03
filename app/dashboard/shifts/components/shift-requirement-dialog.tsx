"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { type ShiftRequirement } from "@/types/shift"

interface ShiftRequirementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requirement: ShiftRequirement | null
  onSuccess: () => void
}

export function ShiftRequirementDialog({
  open,
  onOpenChange,
  requirement,
  onSuccess,
}: ShiftRequirementDialogProps) {
  const [formData, setFormData] = useState({
    day_of_week: requirement?.day_of_week.toString() || "0",
    start_time: requirement?.start_time || "09:00",
    end_time: requirement?.end_time || "17:00",
    required_count: requirement?.required_count.toString() || "1",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const data = {
        day_of_week: parseInt(formData.day_of_week),
        start_time: formData.start_time,
        end_time: formData.end_time,
        required_count: parseInt(formData.required_count),
      }

      if (requirement) {
        const { error } = await supabase
          .from("shift_requirements")
          .update(data)
          .eq("id", requirement.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Shift requirement updated successfully.",
        })
      } else {
        const { error } = await supabase
          .from("shift_requirements")
          .insert([data])

        if (error) throw error

        toast({
          title: "Success",
          description: "Shift requirement created successfully.",
        })
      }

      onSuccess()
    } catch (error) {
      console.error("Error saving shift requirement:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save shift requirement. Please try again.",
      })
    }
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {requirement ? "Edit Shift Requirement" : "Add Shift Requirement"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="day">Day of Week</Label>
              <Select
                value={formData.day_of_week}
                onValueChange={(value) =>
                  setFormData({ ...formData, day_of_week: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day, index) => (
                    <SelectItem key={day} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({ ...formData, start_time: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({ ...formData, end_time: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="count">Required Employees</Label>
              <Input
                id="count"
                type="number"
                min="1"
                value={formData.required_count}
                onChange={(e) =>
                  setFormData({ ...formData, required_count: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {requirement ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 