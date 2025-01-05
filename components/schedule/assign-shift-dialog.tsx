/**
 * Assign Shift Dialog Component
 * 
 * A modal dialog component for assigning employees to specific shifts.
 * Handles employee availability filtering and shift assignment operations.
 * 
 * Features:
 * - Employee availability filtering
 * - Shift assignment handling
 * - Loading states
 * - Error handling
 * - Success notifications
 * - Real-time updates
 */

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

/**
 * Props for the AssignShiftDialog component
 * @property open - Whether the dialog is open
 * @property onOpenChange - Callback for dialog open state changes
 * @property shiftRequirement - The shift requirement to assign
 * @property date - The date for the shift assignment
 * @property onSuccess - Callback for successful assignment
 */
interface AssignShiftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shiftRequirement: ShiftRequirement
  date: string
  onSuccess: () => void
}

/**
 * Dialog component for assigning employees to shifts
 * Filters employees based on availability and handles assignment process
 */
export function AssignShiftDialog({
  open,
  onOpenChange,
  shiftRequirement,
  date,
  onSuccess,
}: AssignShiftDialogProps) {
  // State management
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch available employees when dialog opens
  useEffect(() => {
    if (open) {
      fetchAvailableEmployees()
    }
  }, [open, shiftRequirement, date])

  /**
   * Fetches employees available for the shift
   * Filters based on availability and active status
   */
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

  /**
   * Handles shift assignment
   * Creates a new shift assignment record
   */
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
          {/* Employee selection dropdown */}
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
          {/* Dialog actions */}
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