"use client"

import { useEffect, useState } from "react"
import { EmployeesList } from "./components/employees-list"
import { testConnection } from "@/lib/supabase/test-connection"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function EmployeesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('Checking auth...')
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          console.log('No session found, redirecting to login')
          router.push('/login')
          return
        }

        console.log('Session found:', {
          userId: session.user.id,
          email: session.user.email
        })

        const connectionResult = await testConnection()
        console.log('Connection test result:', connectionResult)
        
        if (!connectionResult) {
          setError('Failed to connect to database')
        }
      } catch (err) {
        console.error('Error in auth check:', err)
        setError('Unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-2 text-blue-500 hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
      </div>
      <EmployeesList />
    </div>
  )
}