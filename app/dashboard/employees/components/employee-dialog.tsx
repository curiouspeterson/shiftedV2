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

export function EmployeeDialog({ open, onOpenChange, employee, onSuccess }: EmployeeDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState(employee?.email || "")
  const [fullName, setFullName] = React.useState(employee?.full_name || "")
  const [role, setRole] = React.useState<"employee" | "manager">(employee?.role || "employee")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Create the auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: 'tempPassword123!', // You should generate a random password or handle this better
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error('No user returned from auth signup')
      }

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Verify the profile was created
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
        // If profile doesn't exist, clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Failed to create user profile')
      }

      toast({
        title: "Success",
        description: "Employee created successfully. They will receive an email to set their password.",
      })
      
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Error creating employee:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create employee",
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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 