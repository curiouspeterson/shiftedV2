/**
 * Assign Shift Dialog Component
 * 
 * A modal dialog component for assigning employees to specific shifts.
 * This component handles:
 * - Fetching available employees based on their availability
 * - Filtering employees based on their schedule conflicts
 * - Assigning shifts to employees
 * - Displaying employee selection UI
 * - Error handling and success notifications
 * 
 * The component integrates with Supabase for data operations and uses
 * shadcn/ui components for the user interface.
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

// Props interface for the AssignShiftDialog component
interface AssignShiftDialogProps {
  open: boolean                                    // Controls dialog visibility
  onOpenChange: (open: boolean) => void           // Callback for dialog state changes
  shiftRequirement: ShiftRequirement              // The shift requirement to be assigned
  date: string                                    // The date for the shift assignment
  onSuccess: () => void                          // Callback for successful assignment
}

export function AssignShiftDialog({
  open,
  onOpenChange,
  shiftRequirement,
  date,
  onSuccess,
}: AssignShiftDialogProps) {
  // State management for employees, selection, and loading
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
   * Fetches available employees from Supabase
   * Filters employees based on:
   * - Active status
   * - Availability for the shift time
   * - Schedule conflicts
   */
  const fetchAvailableEmployees = async () => {
    try {
      console.log('Fetching employees for shift:', {
        date,
        shiftRequirement
      })
      
      const supabase = createClient()
      // Query profiles with their availability
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

      // Process and filter employees based on availability
      const employeesWithAvailability = (data || []).map(employee => {
        const employeeWithAvailability = {
          ...employee,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Employee
        
        const dayOfWeek = new Date(date).getDay()
        console.log('Shift day of week:', dayOfWeek)
        
        // Check if employee has availability for this shift
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
   * Utility function to check if two time periods overlap
   * Used for checking schedule conflicts
   */
  const hasTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
    return start1 < end2 && end1 > start2
  }

  /**
   * Checks for any conflicting shifts for the selected employee
   * Returns true if conflicts exist, false otherwise
   */
  const checkForConflicts = async (employeeId: string) => {
    try {
      const supabase = createClient()
      const { data: existingShifts, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('profile_id', employeeId)
        .eq('date', date)

      if (error) throw error

      // Check for overlapping shifts
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
   * Handles the shift assignment process
   * - Checks for conflicts
   * - Gets employee email
   * - Creates the shift assignment
   * - Handles success/error states
   */
  const handleAssign = async () => {
    if (!selectedEmployeeId) return

    setIsLoading(true)
    try {
      // Check for schedule conflicts
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
      
      // Get the employee's email for the shift record
      const { data: employeeData, error: employeeError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', selectedEmployeeId)
        .single()

      if (employeeError) throw employeeError

      // Create the shift assignment
      const { error } = await supabase
        .from('shifts')
        .insert([
          {
            profile_id: selectedEmployeeId,
            user_email: employeeData.email,
            shift_requirement_id: shiftRequirement.id,
            date,
            start_time: shiftRequirement.start_time,
            end_time: shiftRequirement.end_time,
            status: 'pending'
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

  // Render the dialog with employee selection UI
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Shift</DialogTitle>
        </DialogHeader>

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

          {/* Display warning if no employees are available */}
          {employees.length > 0 && employees.every(e => !e.hasAvailability) && (
            <div className="text-sm text-yellow-600">
              No employees have set their availability for this time slot.
              Please have employees set their availability before assigning shifts.
            </div>
          )}
        </div>

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