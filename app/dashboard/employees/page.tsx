"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Employee {
  id: string
  full_name: string
  email: string
  role: string
  status: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchEmployees() {
      try {
        console.log('Fetching employees...')
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('full_name')

        if (error) {
          console.error('Error fetching employees:', error)
          setError(error.message)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load employees. Please try again.",
          })
          throw error
        }

        console.log('Employees fetched:', data)
        setEmployees(data || [])
      } catch (error) {
        console.error('Error in fetchEmployees:', error)
        setError(error instanceof Error ? error.message : 'Failed to load employees')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading employees...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-lg text-red-500">Error: {error}</div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <Link href="/dashboard/employees/add" passHref>
          <Button>
            Add Employee
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees ({employees.length})</TabsTrigger>
          <TabsTrigger value="time-off-requests">Time Off Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees">
          {employees.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No employees found. Add your first employee to get started.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {employees.map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{employee.full_name}</h3>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {employee.role}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          employee.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {employee.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="time-off-requests">
          <div className="text-center py-10 text-gray-500">
            Time off requests feature coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

