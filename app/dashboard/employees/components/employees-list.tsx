"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { EmployeeDialog } from './employee-dialog'
import { type Employee } from "@/types/employee"

export function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  async function fetchEmployees() {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = createClient()
      console.log('Fetching employees...')
      
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

  useEffect(() => {
    fetchEmployees()
  }, [])

  if (loading) {
    return <div>Loading employees...</div>
  }

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
      <div className="flex justify-end mb-4">
        <Button onClick={() => setDialogOpen(true)}>
          Add Employee
        </Button>
      </div>

      <div className="space-y-4">
        {employees.length === 0 ? (
          <div>No employees found</div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 font-medium">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
            </div>
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

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={null}
        onSuccess={fetchEmployees}
      />
    </div>
  )
} 