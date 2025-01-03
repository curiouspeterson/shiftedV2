"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Plus, X } from "lucide-react"
import { parseISO, isBefore, isEqual } from "date-fns"
import { supabase } from "@/lib/supabase"
import { type Employee, type EmployeeFormData } from "@/types/employee"

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  onSuccess: () => void
}

export function EmployeeDialog({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EmployeeDialogProps) {
  const form = useForm<EmployeeFormData>({
    defaultValues: {
      full_name: employee?.full_name || "",
      email: employee?.email || "",
      role: employee?.role || "employee",
      weekly_hour_limit: employee?.weekly_hour_limit || 40,
      availability: employee?.employee_availability?.map(slot => ({
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time
      })) || []
    }
  })

  const { register, handleSubmit, watch, setValue, formState: { errors: formErrors } } = form
  const formData = watch()

  const [errors, setErrors] = React.useState<{
    availability?: { [key: number]: string }
  }>({})

  const validateAvailability = (availability: EmployeeFormData["availability"]) => {
    const newErrors: { [key: number]: string } = {}

    availability.forEach((slot, index) => {
      const start = parseISO(`2000-01-01T${slot.start_time}`)
      const end = parseISO(`2000-01-01T${slot.end_time}`)

      if (isBefore(end, start) || isEqual(start, end)) {
        newErrors[index] = "End time must be after start time"
      }

      // Check for overlapping slots on the same day
      availability.forEach((otherSlot, otherIndex) => {
        if (
          index !== otherIndex &&
          slot.day_of_week === otherSlot.day_of_week
        ) {
          const otherStart = parseISO(`2000-01-01T${otherSlot.start_time}`)
          const otherEnd = parseISO(`2000-01-01T${otherSlot.end_time}`)

          if (
            (isBefore(start, otherEnd) && isBefore(otherStart, end)) ||
            isEqual(start, otherStart)
          ) {
            newErrors[index] = "Time slots cannot overlap"
          }
        }
      })
    })

    setErrors({ availability: newErrors })
    return Object.keys(newErrors).length === 0
  }

  const handleAddAvailability = () => {
    setValue("availability", [
      ...formData.availability,
      {
        day_of_week: 0,
        start_time: "09:00",
        end_time: "17:00",
      },
    ])
  }

  const handleRemoveAvailability = (index: number) => {
    setValue(
      "availability",
      formData.availability.filter((_: any, i: number) => i !== index)
    )
  }

  const handleDayChange = (index: number, value: string) => {
    const newAvailability = [...formData.availability]
    newAvailability[index] = {
      ...newAvailability[index],
      day_of_week: parseInt(value),
    }
    setValue("availability", newAvailability)
  }

  const handleTimeChange = (
    index: number,
    field: "start_time" | "end_time",
    value: string
  ) => {
    const newAvailability = [...formData.availability]
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value,
    }
    setValue("availability", newAvailability)
  }

  const onSubmit = async (data: EmployeeFormData) => {
    if (!validateAvailability(data.availability)) {
      return
    }

    try {
      let userId = employee?.id

      if (!employee) {
        // Create new user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: Math.random().toString(36).slice(-8),
          options: {
            data: {
              full_name: data.full_name,
              role: data.role,
              weekly_hour_limit: data.weekly_hour_limit,
            },
          },
        })

        if (authError) throw authError
        userId = authData.user?.id
      } else {
        // Update existing user
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            full_name: data.full_name,
            email: data.email,
            role: data.role,
            weekly_hour_limit: data.weekly_hour_limit,
          })
          .eq("id", employee.id)

        if (updateError) throw updateError

        // Delete existing availability
        const { error: deleteError } = await supabase
          .from("employee_availability")
          .delete()
          .eq("profile_id", employee.id)

        if (deleteError) throw deleteError
      }

      if (userId) {
        // Insert new availability
        const { error: availabilityError } = await supabase
          .from("employee_availability")
          .insert(
            data.availability.map((slot) => ({
              profile_id: userId,
              ...slot,
            }))
          )

        if (availabilityError) throw availabilityError
      }

      toast({
        title: "Success",
        description: `Employee ${employee ? "updated" : "created"} successfully.`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving employee:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                {...register("full_name", { required: true })}
              />
              {formErrors.full_name && (
                <p className="text-sm text-destructive">Full name is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: true })}
                disabled={!!employee}
              />
              {formErrors.email && (
                <p className="text-sm text-destructive">Email is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setValue("role", value as "employee" | "manager")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weekly_hour_limit">Weekly Hour Limit</Label>
              <Input
                id="weekly_hour_limit"
                type="number"
                {...register("weekly_hour_limit", {
                  required: true,
                  min: 0,
                  max: 168,
                })}
              />
              {formErrors.weekly_hour_limit && (
                <p className="text-sm text-destructive">
                  Weekly hour limit must be between 0 and 168
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Availability</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAvailability}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Slot
              </Button>
            </div>

            <div className="space-y-4">
              {formData.availability.map((slot: { day_of_week: number; start_time: string; end_time: string }, index: number) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-1 space-y-2">
                    <Label>Day</Label>
                    <Select
                      value={slot.day_of_week.toString()}
                      onValueChange={(value) => handleDayChange(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day: string, i: number) => (
                          <SelectItem key={i} value={i.toString()}>
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
                        handleTimeChange(index, "start_time", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) =>
                        handleTimeChange(index, "end_time", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8"
                    onClick={() => handleRemoveAvailability(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {errors.availability && (
                <div className="space-y-2">
                  {Object.entries(errors.availability).map(([index, error]) => (
                    <p key={index} className="text-sm text-destructive">
                      Slot {parseInt(index) + 1}: {error}
                    </p>
                  ))}
                </div>
              )}
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