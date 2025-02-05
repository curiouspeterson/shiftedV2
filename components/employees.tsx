/**
 * Employees Component
 * 
 * A comprehensive component for managing employee data.
 * Provides functionality for viewing, adding, editing, and deleting employees.
 * 
 * Features:
 * - Employee list display
 * - Add new employee
 * - Edit existing employee
 * - Delete employee
 * - Loading states
 * - Error handling
 * - Real-time feedback
 * - Responsive grid layout
 */

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { type Employee } from "@/types/employee"
import { EmployeeDialog } from "@/app/dashboard/employees/components/employee-dialog"

/**
 * Employees component
 * Manages the display and operations for employee data
 */
export function Employees() {
  // State management
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)

  // Fetch employees on component mount
  React.useEffect(() => {
    fetchEmployees()
  }, [])

  /**
   * Fetches employee data from the database
   * Includes related availability information
   */
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

  /**
   * Opens dialog for adding a new employee
   * Resets selected employee state
   */
  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setIsDialogOpen(true)
  }

  /**
   * Opens dialog for editing an existing employee
   * @param employee - Employee data to edit
   */
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  /**
   * Deletes an employee from the database
   * @param employeeId - ID of employee to delete
   */
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

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add employee button */}
      <div className="flex justify-end">
        <Button onClick={handleAddEmployee}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Employee grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="p-4">
              {/* Employee details */}
              <div className="space-y-2">
                <h3 className="font-medium">{employee.full_name}</h3>
                <p className="text-sm text-gray-500">{employee.email}</p>
                <p className="text-sm text-gray-500 capitalize">{employee.role}</p>
              </div>
              {/* Action buttons */}
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

      {/* Employee dialog for add/edit */}
      <EmployeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />
    </div>
  )
} 