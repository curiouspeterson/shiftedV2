"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { type ShiftRequirement } from "@/types/schedule"

interface AvailabilitySlot {
  day_of_week: number
  start_time: string
  end_time: string
}

interface Employee {
  id: string
  full_name: string
  availability: AvailabilitySlot[]
}

interface AssignShiftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requirement: ShiftRequirement | null
  date: string | null
  onSuccess: () => void
}

export function AssignShiftDialog({
  open,
  onOpenChange,
  requirement,
  date,
  onSuccess,
}: AssignShiftDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open && requirement && date) {
      fetchAvailableEmployees()
    }
  }, [open, requirement, date])

  const fetchAvailableEmployees = async () => {
    if (!requirement || !date) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, employee_availability(*)")
        .order("full_name")

      if (error) throw error

      const employeesWithAvailability = data.map(employee => ({
        ...employee,
        availability: employee.employee_availability || []
      }))

      // Filter employees based on availability
      const availableEmployees = employeesWithAvailability.filter(employee => {
        return employee.availability.some((slot: AvailabilitySlot) => 
          slot.day_of_week === requirement.day_of_week &&
          slot.start_time <= requirement.start_time &&
          slot.end_time >= requirement.end_time
        )
      })

      setEmployees(availableEmployees)
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available employees. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignShift = async (employeeId: string) => {
    if (!requirement || !date) return

    try {
      const { error } = await supabase
        .from("shift_assignments")
        .insert([
          {
            employee_id: employeeId,
            shift_requirement_id: requirement.id,
            date,
          },
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Shift assigned successfully.",
      })
      onSuccess()
    } catch (error) {
      console.error("Error assigning shift:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign shift. Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Shift</DialogTitle>
          {requirement && (
            <DialogDescription>
              {format(new Date(`1970-01-01T${requirement.start_time}`), "h:mm a")} -{" "}
              {format(new Date(`1970-01-01T${requirement.end_time}`), "h:mm a")}
              {date && ` on ${format(new Date(date), "MMM dd, yyyy")}`}
            </DialogDescription>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-[100px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : employees.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No available employees found for this shift.
          </p>
        ) : (
          <Select onValueChange={handleAssignShift}>
            <SelectTrigger>
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </DialogContent>
    </Dialog>
  )
} 