"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AddEmployeeFormData {
  email: string
  fullName: string
  role: 'employee' | 'manager'
}

export default function AddEmployeePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<AddEmployeeFormData>({
    email: '',
    fullName: '',
    role: 'employee'
  })
  const supabase = createClientComponentClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input changed:', e.target.name, e.target.value)
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    console.log('Role changed:', value)
    setFormData(prev => ({ ...prev, role: value as 'employee' | 'manager' }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    setIsLoading(true)

    try {
      // Generate a secure random password
      const password = Math.random().toString(36).slice(-8) + 'Aa1!'
      console.log('Creating new user in Auth...')
      
      // Create the user in Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.fullName,
            role: formData.role
          }
        }
      })

      console.log('Auth signup result:', { authData, signUpError })

      if (signUpError) {
        console.error('Signup error:', signUpError)
        throw signUpError
      }

      if (!authData.user) {
        console.error('No user returned from signup')
        throw new Error('Failed to create user')
      }

      // Wait a moment for the auth user to be fully created
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Creating profile...')
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          role: formData.role,
          status: 'active',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      console.log('Profile creation completed')

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // If profile creation fails, clean up the auth user
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw profileError
      }

      console.log('Success! Employee added')
      toast({
        title: 'Success',
        description: 'Employee added successfully. They will receive an email to set their password.',
      })

      router.push('/dashboard/employees')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add employee'
      })
    } finally {
      console.log('Form submission completed')
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="employee@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
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

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  console.log('Cancel clicked')
                  router.back()
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Employee"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 