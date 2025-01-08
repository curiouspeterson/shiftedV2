/**
 * Sign Up Page Component
 * 
 * Client-side component that handles new user registration.
 * Provides a form interface for users to create their accounts.
 * 
 * Features:
 * - Full name, email, and password collection
 * - Form validation
 * - Loading states during registration
 * - Error handling and display
 * - Automatic redirection to email verification
 * - Link to login for existing users
 */

"use client"

import { signUp } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SignUpFormData {
  email: string
  password: string
  fullName: string
  role: 'employee' | 'manager'
  position: 'Dispatcher' | 'Shift Supervisor' | 'Management'
}

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    fullName: '',
    role: 'employee',
    position: 'Dispatcher'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value as 'employee' | 'manager',
      position: value === 'manager' ? 'Management' : 'Dispatcher'
    }))
  }

  const handlePositionChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      position: value as 'Dispatcher' | 'Shift Supervisor' | 'Management'
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role,
        formData.position
      )
      if (!data.user) {
        setError('Failed to create account')
      } else {
        router.push('/auth/verify')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
                disabled={loading}
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
            {formData.role === 'employee' && (
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={handlePositionChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                    <SelectItem value="Shift Supervisor">Shift Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

