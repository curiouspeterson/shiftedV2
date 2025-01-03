"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { type Employee } from "@/types/employee"

export default function Employees() {
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, employee_availability(*)")
        .order("full_name")

      if (error) {
        console.error("Error fetching employees:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load employees. Please try again.",
        })
      } else {
        const employeesWithAvailability = data?.map(employee => ({
          ...employee,
          availability: employee.employee_availability || []
        })) || []
        setEmployees(employeesWithAvailability)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <h3 className="font-semibold">{employee.full_name}</h3>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
                <p className="text-sm text-muted-foreground capitalize">{employee.role}</p>
              </div>
              <div className="mt-4 space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 