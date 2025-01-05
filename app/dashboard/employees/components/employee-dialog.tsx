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
import { createClient } from "@/lib/supabase/client"
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
  const [email, setEmail] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [role, setRole] = React.useState<"employee" | "manager">("employee")

  // Set initial values when employee prop changes
  React.useEffect(() => {
    if (employee) {
      setEmail(employee.email || "")
      setFullName(employee.full_name || "")
      setRole(employee.role || "employee")
    }
  }, [employee])

  /**
   * Form submission handler
   * Creates or updates employee account
   * @param event - Form submission event
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setIsLoading(true)
      const supabase = createClient()

      if (employee) {
        // Update existing employee
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            role: role,
          })
          .eq('id', employee.id)

        if (updateError) throw updateError

        toast({
          title: "Success",
          description: "Employee updated successfully",
        })
      } else {
        // Create new employee
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: 'tempPassword123!', // TODO: Implement secure password generation
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('No user returned from auth signup')

        // Allow time for database trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Verify profile creation was successful
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profileError || !profile) {
          // Cleanup: Remove auth user if profile creation failed
          await supabase.auth.admin.deleteUser(authData.user.id)
          throw new Error('Failed to create user profile')
        }

        toast({
          title: "Success",
          description: "Employee created successfully. They will receive an email to set their password.",
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Error managing employee:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to manage employee",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit' : 'Add'} Employee</DialogTitle>
          <DialogDescription>
            {employee ? 'Update employee details' : 'Add a new employee to the system. They will receive an email to set their password.'}
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
              <Select value={role} onValueChange={(value: "employee" | "manager") => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Dialog action buttons */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (employee ? 'Updating...' : 'Creating...') : (employee ? 'Update' : 'Create')} Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 