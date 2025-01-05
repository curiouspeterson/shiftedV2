/**
 * Add Employee Page Component
 * 
 * Page component for adding new employees to the system.
 * Provides a form interface for creating employee accounts with authentication.
 * 
 * Features:
 * - Email and full name input
 * - Role selection
 * - Form validation
 * - Password generation
 * - Email verification
 * - Loading states
 * - Error handling
 * - Success notifications
 * - Navigation handling
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from '@supabase/ssr'
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

/**
 * Form data interface for adding a new employee
 * @property email - Employee's email address
 * @property fullName - Employee's full name
 * @property role - Employee's role (employee/manager)
 */
interface AddEmployeeFormData {
    email: string
    fullName: string
    role: 'employee' | 'manager'
}

/**
 * Add employee page component
 * Manages form state and employee creation process
 */
export default function AddEmployeePage() {
    const router = useRouter()
    // State management
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<AddEmployeeFormData>({
        email: '',
        fullName: '',
        role: 'employee'
    })

    // Initialize Supabase client
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    /**
     * Handles input field changes
     * @param e - Change event from input field
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    /**
     * Handles role selection changes
     * @param value - Selected role value
     */
    const handleRoleChange = (value: string) => {
        setFormData(prev => ({ ...prev, role: value as 'employee' | 'manager' }))
    }

    /**
     * Handles form submission
     * Creates user auth record and profile
     * @param e - Form submission event
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Generate a secure random password
            const password = Math.random().toString(36).slice(-8) + 'Aa1!'

            // Create the user in Auth with metadata
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        full_name: formData.fullName,
                        role: formData.role,
                        weekly_hour_limit: 40
                    }
                }
            })

            if (signUpError) {
                throw signUpError
            }

            if (!authData.user) {
                throw new Error('Failed to create user')
            }

            // Show success message
            toast({
                title: 'Success',
                description: 'Employee added successfully. They will receive an email to set their password.',
            })

            // Redirect to employees list
            router.push('/dashboard/employees')
        } catch (error) {
            console.error('Error adding employee:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to add employee'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                {/* Card header */}
                <CardHeader>
                    <CardTitle>Add New Employee</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Employee form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email input field */}
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

                        {/* Full name input field */}
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

                        {/* Role selection field */}
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

                        {/* Form actions */}
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
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