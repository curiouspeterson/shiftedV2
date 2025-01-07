/**
 * Employee Management Dialog Component
 * 
 * A dialog component for creating and managing employee accounts.
 * Handles user creation in Supabase Auth and profile management.
 * 
 * Features:
 * - Create new employee accounts
 * - Set employee roles (employee/manager)
 * - Automatic profile creation through Supabase triggers
 * - Email notification for password setup
 * - Error handling and user feedback
 */

"use client"

import * as React from "react"
import { useSupabase } from '@/components/providers/supabase-provider'
import type { Database } from '../../../../lib/database.types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { type Employee } from "@/types/employee"

/**
 * Props for the EmployeeDialog component
 * @property open - Controls dialog visibility
 * @property onOpenChange - Callback for dialog open state changes
 * @property employee - Employee data for editing mode (null for create mode)
 * @property onSuccess - Callback function after successful operation
 */
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
  // State management for form fields and loading state
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState(employee?.email || "")
  const [fullName, setFullName] = React.useState(employee?.full_name || "")
  const [role, setRole] = React.useState<"employee" | "manager">(employee?.role || "employee")
  const [weeklyHourLimit, setWeeklyHourLimit] = React.useState<number>(employee?.weekly_hour_limit || 40)

  const { supabase } = useSupabase()

  // Reset form fields when the dialog is opened
  React.useEffect(() => {
    if (open) {
      setEmail(employee?.email || "")
      setFullName(employee?.full_name || "")
      setRole((employee?.role as "employee" | "manager") || "employee")
      setWeeklyHourLimit(employee?.weekly_hour_limit || 40)
    }
  }, [open, employee])

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
            {/* Role selection dropdown */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value: "employee" | "manager") =>
                  setRole(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Weekly Hour Limit input field */}
            <div className="space-y-2">
              <Label htmlFor="weeklyHourLimit">Weekly Hour Limit</Label>
              <Input
                id="weeklyHourLimit"
                type="number"
                min={0}
                max={168}
                value={weeklyHourLimit}
                onChange={(e) => setWeeklyHourLimit(Number(e.target.value))}
                required
              />
            </div>
          </div>
          {/* Dialog action buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? employee
                  ? "Updating..."
                  : "Creating..."
                : employee
                ? "Update"
                : "Create"}
              Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 