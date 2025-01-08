/**
 * Employee Dialog Component
 * 
 * Dialog component for creating and editing employee information.
 * Provides form interface for employee data management.
 * 
 * Features:
 * - Email and full name input
 * - Role selection (employee/manager)
 * - Position selection (Dispatcher, Shift Supervisor, Management)
 * - Weekly hour limit setting
 * - Form validation
 * - Loading states
 * - Error handling
 * - Success notifications
 */

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { type Employee } from "@/types/employee"

interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  onSuccess: () => void
}

/**
 * Dialog component for employee management
 * Provides interface for creating and editing employee accounts
 */
export function EmployeeDialog({ open, onOpenChange, employee, onSuccess }: EmployeeDialogProps) {
  const supabase = createClient()
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState(employee?.email || "")
  const [fullName, setFullName] = useState(employee?.full_name || "")
  const [role, setRole] = useState<'employee' | 'manager'>(employee?.role as 'employee' | 'manager' || "employee")
  const [position, setPosition] = useState<'Dispatcher' | 'Shift Supervisor' | 'Management'>(
    employee?.position as 'Dispatcher' | 'Shift Supervisor' | 'Management' || "Dispatcher"
  )
  const [weeklyHourLimit, setWeeklyHourLimit] = useState(employee?.weekly_hour_limit || 40)

  /**
   * Form submission handler
   * Creates or updates employee account
   * @param event - Form submission event
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setIsLoading(true)

      if (employee) {
        // Update existing employee
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            email: email,
            role: role,
            position: position,
            weekly_hour_limit: weeklyHourLimit,
          })
          .eq("id", employee.id)

        if (updateError) throw updateError

        toast({
          title: "Success",
          description: "Employee updated successfully",
        })
      } else {
        // Create new employee using API route
        const response = await fetch('/api/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'create',
            data: {
              email,
              name: fullName,
              role,
              position,
              weekly_hour_limit: weeklyHourLimit,
            },
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to create employee')
        }

        toast({
          title: "Success",
          description:
            "Employee created successfully. They will receive an email to set their password.",
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error("Error managing employee:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to manage employee",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{employee ? "Edit" : "Add"} Employee</DialogTitle>
          <DialogDescription>
            {employee
              ? "Update employee details"
              : "Add a new employee to the system. They will receive an email to set their password."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Email input field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!!employee} // Email can't be changed for existing employees
              />
            </div>

            {/* Full name input field */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Weekly hour limit input field */}
            <div className="space-y-2">
              <Label htmlFor="weeklyHourLimit">Weekly Hour Limit</Label>
              <Input
                id="weeklyHourLimit"
                type="number"
                min={0}
                max={168}
                value={weeklyHourLimit}
                onChange={(e) => setWeeklyHourLimit(parseInt(e.target.value))}
                required
              />
            </div>

            {/* Role selection field */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value: 'employee' | 'manager') => {
                  setRole(value)
                  // Update position based on role
                  setPosition(value === 'manager' ? 'Management' : 'Dispatcher')
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Position selection field */}
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={position}
                onValueChange={(value: 'Dispatcher' | 'Shift Supervisor' | 'Management') => 
                  setPosition(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {role === 'employee' ? (
                    <>
                      <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                      <SelectItem value="Shift Supervisor">Shift Supervisor</SelectItem>
                    </>
                  ) : (
                    <SelectItem value="Management">Management</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Form actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : employee ? "Update" : "Add"} Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 