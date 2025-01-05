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
  DialogFooter,
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
import { Label } from "@/components/ui/label"

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
      console.log('Fetching employees for shift:', {
        date,
        shiftRequirement
      })
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          role,
          availability:employee_availability (
            day_of_week,
            start_time,
            end_time
          )
        `)
        .eq('is_active', true)

      if (error) throw error
      
      console.log('Raw profiles data:', data)

      // Transform employees and check availability
      const employeesWithAvailability = (data || []).map(employee => {
        const employeeWithAvailability = {
          ...employee,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Employee
        
        const dayOfWeek = new Date(date).getDay()
        console.log('Shift day of week:', dayOfWeek)
        
        const hasAvailability = employeeWithAvailability.availability?.some(slot => {
          const matches = (
            slot.day_of_week === dayOfWeek &&
            slot.start_time <= shiftRequirement.start_time &&
            slot.end_time >= shiftRequirement.end_time
          )
          console.log('Availability slot:', {
            slot,
            shiftStart: shiftRequirement.start_time,
            shiftEnd: shiftRequirement.end_time,
            matches
          })
          return matches
        })
        
        console.log('Employee available:', hasAvailability)
        return {
          ...employeeWithAvailability,
          hasAvailability
        }
      })

      console.log('Employees with availability status:', employeesWithAvailability)
      setEmployees(employeesWithAvailability)
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employees",
      })
    }
  }

  /**
   * Checks if a shift overlaps with another shift
   */
  const hasTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
    return start1 < end2 && end1 > start2
  }

  /**
   * Checks if an employee has any conflicting shifts on the given date
   */
  const checkForConflicts = async (employeeId: string) => {
    try {
      const supabase = createClient()
      const { data: existingShifts, error } = await supabase
        .from('shift_assignments')
        .select('*')
        .eq('profile_id', employeeId)
        .eq('date', date)

      if (error) throw error

      // Check for any overlapping shifts
      const conflicts = existingShifts?.filter(shift => 
        hasTimeOverlap(
          shift.start_time,
          shift.end_time,
          shiftRequirement.start_time,
          shiftRequirement.end_time
        )
      )

      return conflicts?.length > 0
    } catch (error) {
      console.error('Error checking for conflicts:', error)
      return false
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
      // Check for conflicts before assigning
      const hasConflicts = await checkForConflicts(selectedEmployeeId)
      if (hasConflicts) {
        toast({
          variant: "destructive",
          title: "Schedule Conflict",
          description: "This employee already has a shift during this time period",
        })
        return
      }

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

        {/* Employee selection */}
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Employee</Label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.length === 0 ? (
                  <SelectItem value="" disabled>No employees available</SelectItem>
                ) : (
                  employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={employee.id}
                      disabled={!employee.hasAvailability}
                    >
                      {employee.full_name}
                      {!employee.hasAvailability && " (No availability set)"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Warning message for no availability */}
          {employees.length > 0 && employees.every(e => !e.hasAvailability) && (
            <div className="text-sm text-yellow-600">
              No employees have set their availability for this time slot.
              Please have employees set their availability before assigning shifts.
            </div>
          )}
        </div>

        {/* Dialog actions */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedEmployeeId || isLoading}
          >
            {isLoading ? "Assigning..." : "Assign Shift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 