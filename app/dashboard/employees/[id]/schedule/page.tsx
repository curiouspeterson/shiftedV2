/**
 * Employee Schedule Page Component
 * 
 * A page component for managing individual employee schedules.
 * Provides an interface for viewing and modifying employee work schedules.
 * 
 * Features:
 * - Employee data fetching
 * - Schedule management interface
 * - Loading states
 * - Error handling with toast notifications
 * - Not found state handling
 */

"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { EmployeeScheduleManager } from "@/components/employee-schedule-manager"
import { type Employee } from "@/types/employee"
import { toast } from "@/components/ui/use-toast"

/**
 * Employee schedule page component
 * Manages the display and interaction with employee schedules
 * 
 * @property params - Route parameters containing employee ID
 */
export default function EmployeeSchedulePage({ params }: { params: { id: string } }) {
  // State management for employee data and loading
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Fetches employee data from the database
   * Updates state and handles errors with toast notifications
   */
  const fetchEmployee = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setEmployee(data)
    } catch (error) {
      console.error('Error fetching employee:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employee data",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch employee data on component mount
  useEffect(() => {
    fetchEmployee()
  }, [params.id])

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Show not found message if employee doesn't exist
  if (!employee) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">Employee Not Found</h1>
        <p className="text-gray-500">The employee you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage {employee.full_name || 'Employee'}'s Schedule</h1>
      <EmployeeScheduleManager 
        employee={employee} 
        onUpdate={fetchEmployee}
      />
    </div>
  )
}

