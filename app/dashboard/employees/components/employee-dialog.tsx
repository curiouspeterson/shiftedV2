"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { type Employee } from "@/types/employee"
import { Plus, X } from "lucide-react"
import { parseISO, isBefore, isEqual } from "date-fns"

interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  onSuccess: () => void
}

interface FormData {
  full_name: string
  email: string
  role: string
  availability: {
    day_of_week: number
    start_time: string
    end_time: string
  }[]
}

const ROLES = ["employee", "manager", "admin"] as const
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export function EmployeeDialog({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeDialogProps) {
  const [formData, setFormData] = React.useState<FormData>({
    full_name: employee?.full_name || "",
    email: employee?.email || "",
    role: employee?.role || "employee",
    availability: employee?.availability || [],
  })
  const [errors, setErrors] = React.useState<{
    availability?: { [key: number]: string }
  }>({})

  const validateAvailability = () => {
    const newErrors: { [key: number]: string } = {}
    const sortedSlots = [...formData.availability].sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) {
        return a.day_of_week - b.day_of_week
      }
      return a.start_time.localeCompare(b.start_time)
    })

    sortedSlots.forEach((slot, index) => {
      // Check if end time is after start time
      const startDate = parseISO(`2000-01-01T${slot.start_time}`)
      const endDate = parseISO(`2000-01-01T${slot.end_time}`)
      
      if (isEqual(startDate, endDate) || isBefore(endDate, startDate)) {
        newErrors[index] = "End time must be after start time"
        return
      }

      // Check for overlaps with other slots on the same day
      const overlappingSlot = sortedSlots.find((otherSlot, otherIndex) => {
        if (index === otherIndex || slot.day_of_week !== otherSlot.day_of_week) {
          return false
        }

        const otherStartDate = parseISO(`2000-01-01T${otherSlot.start_time}`)
        const otherEndDate = parseISO(`2000-01-01T${otherSlot.end_time}`)

        return (
          (isBefore(startDate, otherEndDate) && isBefore(otherStartDate, endDate)) ||
          isEqual(startDate, otherStartDate) ||
          isEqual(endDate, otherEndDate)
        )
      })

      if (overlappingSlot) {
        newErrors[index] = "Time slot overlaps with another slot"
      }
    })

    setErrors({ availability: Object.keys(newErrors).length > 0 ? newErrors : undefined })
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateAvailability()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fix the availability errors before saving.",
      })
      return
    }

    try {
      if (employee) {
        // Update existing employee
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            email: formData.email,
            role: formData.role,
          })
          .eq("id", employee.id)

        if (profileError) throw profileError

        // Delete existing availability
        const { error: deleteError } = await supabase
          .from("employee_availability")
          .delete()
          .eq("employee_id", employee.id)

        if (deleteError) throw deleteError

        // Insert new availability
        if (formData.availability.length > 0) {
          const { error: availabilityError } = await supabase
            .from("employee_availability")
            .insert(
              formData.availability.map(a => ({
                ...a,
                employee_id: employee.id,
              }))
            )

          if (availabilityError) throw availabilityError
        }

        toast({
          title: "Success",
          description: "Employee updated successfully.",
        })
      } else {
        // Create new employee
        const { data: newEmployee, error: profileError } = await supabase
          .from("profiles")
          .insert([{
            full_name: formData.full_name,
            email: formData.email,
            role: formData.role,
          }])
          .select()
          .single()

        if (profileError) throw profileError

        // Insert availability for new employee
        if (formData.availability.length > 0) {
          const { error: availabilityError } = await supabase
            .from("employee_availability")
            .insert(
              formData.availability.map(a => ({
                ...a,
                employee_id: newEmployee.id,
              }))
            )

          if (availabilityError) throw availabilityError
        }

        toast({
          title: "Success",
          description: "Employee created successfully.",
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving employee:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save employee. Please try again.",
      })
    }
  }

  const addAvailability = () => {
    setFormData(prev => ({
      ...prev,
      availability: [
        ...prev.availability,
        {
          day_of_week: 0,
          start_time: "09:00",
          end_time: "17:00",
        },
      ],
    }))
  }

  const removeAvailability = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }))
    setErrors(prev => {
      if (!prev.availability) return prev
      const newAvailability = { ...prev.availability }
      delete newAvailability[index]
      return { availability: Object.keys(newAvailability).length > 0 ? newAvailability : undefined }
    })
  }

  const updateAvailability = (index: number, field: keyof FormData["availability"][0], value: string | number) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      ),
    }))
    // Clear error when the user makes a change
    setErrors(prev => {
      if (!prev.availability) return prev
      const newAvailability = { ...prev.availability }
      delete newAvailability[index]
      return { availability: Object.keys(newAvailability).length > 0 ? newAvailability : undefined }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  full_name: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  role: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Availability</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAvailability}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </div>
            <div className="space-y-4">
              {formData.availability.map((slot, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Label>Day</Label>
                      <Select
                        value={String(slot.day_of_week)}
                        onValueChange={(value) =>
                          updateAvailability(index, "day_of_week", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day, i) => (
                            <SelectItem key={i} value={String(i)}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={slot.start_time}
                        onChange={(e) =>
                          updateAvailability(index, "start_time", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={slot.end_time}
                        onChange={(e) =>
                          updateAvailability(index, "end_time", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAvailability(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.availability?.[index] && (
                    <p className="text-sm text-destructive">
                      {errors.availability[index]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {employee ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 