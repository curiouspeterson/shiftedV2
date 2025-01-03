"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { type Employee } from "@/types/employee"
import { EmployeeDialog } from "@/app/dashboard/employees/components/employee-dialog"

export function Employees() {
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)

  React.useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          availability:employee_availability (*)
        `)
        .order('full_name')

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employees",
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
        .from('profiles')
        .delete()
        .eq('id', employeeId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Employee deleted successfully",
      })
      fetchEmployees()
    } catch (error) {
      console.error('Error deleting employee:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete employee",
      })
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
        <Button onClick={handleAddEmployee}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">{employee.full_name}</h3>
                <p className="text-sm text-gray-500">{employee.email}</p>
                <p className="text-sm text-gray-500 capitalize">{employee.role}</p>
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