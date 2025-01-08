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

/**
 * Sign up form component
 * Manages registration state and form submission
 */
export default function SignUpPage() {
  const router = useRouter()
  // State management for loading and error states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Form submission handler
   * Processes user registration with provided information
   * 
   * @param event - Form submission event
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    // Extract form data
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    try {
      // Attempt user registration
      const data = await signUp(email, password, fullName)
      if (!data.user) {
        setError('Failed to create account')
      } else {
        // Redirect to verification page on success
        router.push('/auth/verify')
      }
    } catch (e) {
      // Handle registration errors
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
            {/* Full name input field */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                disabled={loading}
              />
            </div>
            {/* Email input field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
              />
            </div>
            {/* Password input field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={loading}
              />
            </div>
            {/* Error message display */}
            {error && (
              <div className="text-sm text-red-500">
                {error}
              </div>
            )}
            {/* Submit button with loading state */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
            {/* Login link for existing users */}
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

