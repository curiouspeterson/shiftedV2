/**
 * Employees List Component
 * 
 * Component for displaying and managing a list of employees.
 * Provides real-time updates and employee management functionality.
 * 
 * Features:
 * - Real-time employee list
 * - Add new employees
 * - View employee details
 * - Loading states
 * - Error handling
 * - Empty state handling
 * - Grid layout display
 */

"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { EmployeeDialog } from './employee-dialog'
import { type Employee } from "@/types/employee"
import Link from 'next/link'

/**
 * Employees list component
 * Manages employee data display and interactions
 * 
 * Features:
 * - Employee data fetching
 * - Add employee dialog
 * - Error state handling
 * - Loading state display
 * - Grid layout presentation
 */
export function EmployeesList() {
  // State management
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  /**
   * Fetches employee data from the database
   * Handles loading states and error handling
   */
  async function fetchEmployees() {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = createClient()
      console.log('Fetching employees...')
      
      // Fetch employee profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, is_active')
        .order('full_name')

      if (error) {
        console.error('Fetch error:', error)
        throw error
      }

      console.log('Fetch successful:', data)
      setEmployees(data || [])
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch employees')
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employees",
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles employee deletion
   * @param employeeId - ID of employee to delete
   */
  const handleDelete = async (employeeId: string) => {
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
    } catch (err) {
      console.error('Error deleting employee:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete employee",
      })
    }
  }

  /**
   * Opens edit dialog for an employee
   * @param employee - Employee to edit
   */
  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setDialogOpen(true)
  }

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Show loading state
  if (loading) {
    return <div>Loading employees...</div>
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
        <button 
          onClick={fetchEmployees}
          className="ml-2 text-blue-500 hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Add employee button */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => {
          setSelectedEmployee(null)
          setDialogOpen(true)
        }}>
          Add Employee
        </Button>
      </div>

      {/* Employee list grid */}
      <div className="space-y-4">
        {employees.length === 0 ? (
          // Empty state message
          <div>No employees found</div>
        ) : (
          <>
            {/* Grid header */}
            <div className="grid grid-cols-5 gap-4 font-medium p-4 bg-muted rounded-lg">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Employee rows */}
            {employees.map((employee) => (
              <div key={employee.id} className="grid grid-cols-5 gap-4 p-4 rounded-lg border items-center">
                <div>{employee.full_name}</div>
                <div>{employee.email}</div>
                <div className="capitalize">{employee.role}</div>
                <div>{employee.is_active ? 'Active' : 'Inactive'}</div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/dashboard/employees/${employee.id}/availability`}>
                      Set Availability
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add/edit employee dialog */}
      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        onSuccess={fetchEmployees}
      />
    </div>
  )
} 