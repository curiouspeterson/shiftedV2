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

interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: Employee | null
  onSuccess: () => void
}

type EmployeeRole = "employee" | "manager"

export function EmployeeDialog({ open, onOpenChange, employee, onSuccess }: EmployeeDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState(employee?.email || "")
  const [fullName, setFullName] = React.useState(employee?.full_name || "")
  const [role, setRole] = React.useState<EmployeeRole>(employee?.role as EmployeeRole || "employee")
  const [weeklyHourLimit, setWeeklyHourLimit] = React.useState(employee?.weekly_hour_limit?.toString() || "40")

  React.useEffect(() => {
    if (employee) {
      setEmail(employee.email)
      setFullName(employee.full_name)
      setRole(employee.role as EmployeeRole)
      setWeeklyHourLimit(employee.weekly_hour_limit?.toString() || "40")
    } else {
      setEmail("")
      setFullName("")
      setRole("employee")
      setWeeklyHourLimit("40")
    }
  }, [employee])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const data = {
        email,
        full_name: fullName,
        role,
        weekly_hour_limit: parseInt(weeklyHourLimit),
        updated_at: new Date().toISOString()
      }

      if (employee) {
        // Update existing employee
        const { error } = await supabase
          .from('profiles')
          .update(data)
          .eq('id', employee.id)

        if (error) throw error
      } else {
        // Create new employee
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'temppass123', // You should implement a proper password system
          options: {
            data: {
              full_name: fullName,
              role,
              weekly_hour_limit: parseInt(weeklyHourLimit),
            }
          }
        })

        if (signUpError) throw signUpError
      }

      toast({
        title: "Success",
        description: `Employee ${employee ? 'updated' : 'created'} successfully`,
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving employee:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${employee ? 'update' : 'create'} employee`,
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
            {employee ? 'Update employee details' : 'Add a new employee to the system'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!!employee}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: EmployeeRole) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeklyHourLimit">Weekly Hour Limit</Label>
              <Input
                id="weeklyHourLimit"
                type="number"
                min="0"
                max="168"
                value={weeklyHourLimit}
                onChange={(e) => setWeeklyHourLimit(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : employee ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 