"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
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
import { toast } from "@/components/ui/use-toast"
import { type ShiftRequirement } from "@/types/schedule"
import { type Employee } from "@/types/employee"

interface AssignShiftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shiftRequirement: ShiftRequirement
  date: string
  onSuccess: () => void
}

export function AssignShiftDialog({
  open,
  onOpenChange,
  shiftRequirement,
  date,
  onSuccess,
}: AssignShiftDialogProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchAvailableEmployees()
    }
  }, [open, shiftRequirement, date])

  const fetchAvailableEmployees = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          role,
          weekly_hour_limit,
          availability:employee_availability (
            day_of_week,
            start_time,
            end_time
          )
        `)
        .eq('is_active', true)

      if (error) throw error

      // Filter employees based on availability
      const availableEmployees = (data || []).filter(employee => {
        const employeeWithAvailability = {
          ...employee,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Employee
        return employeeWithAvailability.availability?.some(slot => {
          return (
            slot.day_of_week === new Date(date).getDay() &&
            slot.start_time <= shiftRequirement.start_time &&
            slot.end_time >= shiftRequirement.end_time
          )
        })
      })

      setEmployees(availableEmployees as Employee[])
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch available employees",
      })
    }
  }

  const handleAssign = async () => {
    if (!selectedEmployeeId) return

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('shift_assignments')
        .insert([
          {
            profile_id: selectedEmployeeId,
            shift_requirement_id: shiftRequirement.id,
            date,
            start_time: shiftRequirement.start_time,
            end_time: shiftRequirement.end_time,
          },
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Shift assigned successfully",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error assigning shift:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign shift",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Shift</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
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
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedEmployeeId || isLoading}>
              {isLoading ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 