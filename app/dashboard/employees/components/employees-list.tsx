"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { type Employee } from "@/types/employee"
import { EmployeeDialog } from "./employee-dialog"
import { format } from "date-fns"

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export function EmployeesList() {
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)

  React.useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      
      // Fetch all active employees from the profiles table
      const { data: employeesData, error: employeesError } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name")

      if (employeesError) throw employeesError

      // Fetch all availability records
      const { data: availabilityData, error: availabilityError } = await supabase
        .from("employee_availability")
        .select("*")

      if (availabilityError) throw availabilityError
      
      // Combine employee data with their availability
      const formattedData = employeesData.map(employee => ({
        ...employee,
        availability: availabilityData.filter(
          availability => availability.profile_id === employee.id
        )
      })) as Employee[]
      
      setEmployees(formattedData)
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

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setIsDialogOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", employeeId)

      if (error) {
        console.error("Error deleting employee:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete employee. Please try again.",
        })
      } else {
        toast({
          title: "Success",
          description: "Employee deleted successfully.",
        })
        fetchEmployees()
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
    }
  }

  const formatTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), "h:mm a")
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
        <Button onClick={handleAddEmployee}>
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
                {employee.availability?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Availability</h4>
                    <div className="space-y-1">
                      {employee.availability
                        .sort((a, b) => a.day_of_week - b.day_of_week)
                        .map((slot) => (
                          <p key={slot.id} className="text-sm text-muted-foreground">
                            {DAYS_OF_WEEK[slot.day_of_week]}: {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </p>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditEmployee(employee)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDeleteEmployee(employee.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EmployeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />
    </div>
  )
} 