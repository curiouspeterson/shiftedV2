/**
 * Add Employee Form Component
 * 
 * Form component for adding new employees to the system.
 * Handles user creation in Auth and profile creation in the database.
 * 
 * Features:
 * - Email and full name input
 * - Role selection (employee/manager)
 * - Weekly hour limit setting
 * - Automatic password generation
 * - Email verification flow
 * - Form validation
 * - Loading states
 * - Error handling
 * - Success notifications
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

/**
 * Form data structure for adding a new employee
 * @property email - Employee's email address
 * @property fullName - Employee's full name
 * @property role - Employee's role (employee/manager)
 * @property weeklyHourLimit - Maximum weekly working hours
 */
interface AddEmployeeFormData {
  email: string
  fullName: string
  role: 'employee' | 'manager'
  weeklyHourLimit: number
}

/**
 * Add employee form component
 * Manages form state and submission for new employees
 */
export function AddEmployeeForm() {
  const router = useRouter()
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<AddEmployeeFormData>({
    email: '',
    fullName: '',
    role: 'employee',
    weeklyHourLimit: 40
  })

  /**
   * Form submission handler
   * Creates user auth record and profile in database
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Generate a secure random password
      const password = Math.random().toString(36).slice(-8) + 'Aa1!'

      // Create the user in Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.fullName,
            role: formData.role,
            weekly_hour_limit: formData.weeklyHourLimit
          }
        }
      })

      if (signUpError) throw signUpError

      if (!authData.user) {
        throw new Error('Failed to create user')
      }

      // Wait for trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Verify profile creation
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) {
        // Clean up auth user if profile creation failed
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Failed to create user profile')
      }

      // Show success message
      toast({
        title: 'Success',
        description: 'Employee added successfully. They will receive an email to set their password.',
      })

      // Redirect to employees list
      router.push('/dashboard/employees')
    } catch (error) {
      // Handle and display errors
      toast({
        title: 'Error adding employee',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email input field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="employee@example.com"
          required
        />
      </div>

      {/* Full name input field */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
          placeholder="John Doe"
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
          value={formData.weeklyHourLimit}
          onChange={(e) => setFormData(prev => ({ ...prev, weeklyHourLimit: parseInt(e.target.value) }))}
          required
        />
      </div>

      {/* Role selection field */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value: 'employee' | 'manager') => setFormData(prev => ({ ...prev, role: value }))}
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

      {/* Submit button with loading state */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Employee"}
      </Button>
    </form>
  )
}

