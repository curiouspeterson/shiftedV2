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

  React.useEffect(() => {
    if (employee) {
      setEmail(employee.email)
      setFullName(employee.full_name)
      setRole(employee.role as EmployeeRole)
    } else {
      setEmail("")
      setFullName("")
      setRole("employee")
    }
  }, [employee])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: employee ? 'update' : 'create',
          data: {
            id: employee?.id,
            email,
            full_name: fullName,
            role,
          }
        })
      })

      let errorMessage = 'Failed to save employee'
      if (!response.ok) {
        try {
          const error = await response.json()
          console.error('Server error response:', error)
          errorMessage = error.message || error.error || errorMessage
        } catch (e) {
          console.error('Failed to parse error response:', e)
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Operation successful:', result)

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
        description: error instanceof Error ? error.message : `Failed to ${employee ? 'update' : 'create'} employee`,
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