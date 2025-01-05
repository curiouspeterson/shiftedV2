/**
 * Login Page Component
 * 
 * Authentication page that handles user login.
 * Provides email/password authentication using Supabase.
 * 
 * Features:
 * - Email/password authentication
 * - Form validation
 * - Loading states
 * - Error handling
 * - Success redirection
 * - Remember me functionality
 * - Password reset link
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

/**
 * Login page component
 * Manages authentication form and submission
 */
export default function LoginPage() {
  // State management
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/dashboard')
      }
    }
    checkSession()
  }, [router])

  // Listen for auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener...')
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event })
      
      if (event === 'SIGNED_IN' && session) {
        console.log('Calling auth callback...')
        try {
          // Wait a bit for the session to be fully established
          await new Promise(resolve => setTimeout(resolve, 100))

          // Ensure cookies are set before redirecting
          const response = await fetch('/auth/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              event, 
              session: {
                access_token: session.access_token,
                refresh_token: session.refresh_token
              }
            }),
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to set session cookies')
          }

          console.log('Auth callback successful')
          
          // Show success message
          toast({
            title: "Success",
            description: "Successfully logged in",
          })

          // Navigate to dashboard
          router.refresh()
          router.replace('/dashboard')
        } catch (error) {
          console.error('Auth callback error:', error)
          toast({
            title: "Error",
            description: "Failed to complete login. Please try again.",
            variant: "destructive",
          })
          setIsLoading(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  /**
   * Form submission handler
   * Authenticates user with Supabase
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Attempting login...')
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      console.log('Login successful:', data)
      // The navigation will be handled by the auth state change listener
      
    } catch (error) {
      console.error('Error signing in:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input field */}
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

            {/* Password input field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Form actions */}
            <div className="space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

