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

  /**
   * Fetches employee data from the database
   * Handles loading states and error handling
   * 
   * @returns void
   * @throws Error if fetch operation fails
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
        <Button onClick={() => setDialogOpen(true)}>
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
            <div className="grid grid-cols-4 gap-4 font-medium">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
            </div>

            {/* Employee rows */}
            {employees.map((employee) => (
              <div key={employee.id} className="grid grid-cols-4 gap-4">
                <div>{employee.full_name}</div>
                <div>{employee.email}</div>
                <div>{employee.role}</div>
                <div>{employee.is_active ? 'Active' : 'Inactive'}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add/edit employee dialog */}
      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={null}
        onSuccess={fetchEmployees}
      />
    </div>
  )
} 