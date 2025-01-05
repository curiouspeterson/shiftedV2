/**
 * Employee Schedule Component
 * 
 * Displays and manages an individual employee's shift schedule.
 * Provides functionality for viewing and responding to shift assignments.
 * 
 * Features:
 * - Date range filtering
 * - Shift details display
 * - Status indicators
 * - Accept/reject actions
 * - Real-time updates
 * - Loading states
 * - Error handling
 * - Empty state handling
 */

"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

/**
 * Shift data structure
 * @property name - Name or description of the shift
 * @property start_time - Start time of the shift
 * @property end_time - End time of the shift
 */
interface Shift {
  name: string
  start_time: string
  end_time: string
}

/**
 * Shift assignment data structure
 * @property id - Unique identifier for the assignment
 * @property shift_id - ID of the assigned shift
 * @property status - Current status of the assignment
 * @property shift - Associated shift details
 */
interface ShiftAssignment {
  id: string
  shift_id: string
  status: 'pending' | 'accepted' | 'rejected'
  shift: Shift
}

/**
 * Component props
 * @property employeeId - ID of the employee whose schedule to display
 * @property startDate - Start date for schedule range
 * @property endDate - End date for schedule range
 */
interface EmployeeScheduleProps {
  employeeId: string
  startDate: Date
  endDate: Date
}

/**
 * Employee schedule component
 * Manages the display and interaction with shift assignments
 */
export function EmployeeSchedule({ employeeId, startDate, endDate }: EmployeeScheduleProps) {
  // State management
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch schedule when props change
  useEffect(() => {
    fetchSchedule()
  }, [employeeId, startDate, endDate])

  /**
   * Fetches shift assignments for the employee
   * Filters by date range and transforms response data
   */
  const fetchSchedule = async () => {
    setIsLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Query shift assignments with related shift data
      const { data, error } = await supabase
        .from('shift_assignments')
        .select(`
          id,
          shift_id,
          status,
          shift:shift_requirements (
            name,
            start_time,
            end_time
          )
        `)
        .eq('employee_id', employeeId)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))

      if (error) throw error

      // Transform the data to match our ShiftAssignment type
      const transformedData: ShiftAssignment[] = (data || []).map(item => ({
        id: item.id,
        shift_id: item.shift_id,
        status: item.status,
        shift: Array.isArray(item.shift) ? item.shift[0] : item.shift
      }))

      setAssignments(transformedData)
    } catch (error) {
      toast({
        title: "Error fetching schedule",
        description: error instanceof Error ? error.message : "Failed to fetch schedule",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Updates the status of a shift assignment
   * @param assignmentId - ID of the assignment to update
   * @param newStatus - New status to set
   */
  const handleStatusChange = async (assignmentId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Update assignment status
      const { error } = await supabase
        .from('shift_assignments')
        .update({ status: newStatus })
        .eq('id', assignmentId)

      if (error) throw error

      // Show success message
      toast({
        title: "Success",
        description: `Shift ${newStatus} successfully`,
      })

      // Update local state
      setAssignments(prev =>
        prev.map(assignment =>
          assignment.id === assignmentId
            ? { ...assignment, status: newStatus }
            : assignment
        )
      )
    } catch (error) {
      toast({
        title: "Error updating shift status",
        description: error instanceof Error ? error.message : "Failed to update shift status",
        variant: "destructive"
      })
    }
  }

  // Show loading state
  if (isLoading) {
    return <div>Loading schedule...</div>
  }

  // Show empty state
  if (assignments.length === 0) {
    return <div>No shifts scheduled for this period.</div>
  }

  return (
    <div className="space-y-4">
      {/* Map through and display assignments */}
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{assignment.shift.name}</span>
              {/* Status badge */}
              <Badge
                variant={
                  assignment.status === 'accepted'
                    ? 'secondary'
                    : assignment.status === 'rejected'
                    ? 'destructive'
                    : 'default'
                }
              >
                {assignment.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Shift time display */}
            <p>
              {assignment.shift.start_time} - {assignment.shift.end_time}
            </p>
            {/* Action buttons for pending assignments */}
            {assignment.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleStatusChange(assignment.id, 'accepted')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusChange(assignment.id, 'rejected')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

