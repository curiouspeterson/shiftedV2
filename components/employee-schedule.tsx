"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface Shift {
  name: string
  start_time: string
  end_time: string
}

interface ShiftAssignment {
  id: string
  shift_id: string
  status: 'pending' | 'accepted' | 'rejected'
  shift: Shift
}

interface EmployeeScheduleProps {
  employeeId: string
  startDate: Date
  endDate: Date
}

export function EmployeeSchedule({ employeeId, startDate, endDate }: EmployeeScheduleProps) {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSchedule()
  }, [employeeId, startDate, endDate])

  const fetchSchedule = async () => {
    setIsLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

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

  const handleStatusChange = async (assignmentId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase
        .from('shift_assignments')
        .update({ status: newStatus })
        .eq('id', assignmentId)

      if (error) throw error

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

  if (isLoading) {
    return <div>Loading schedule...</div>
  }

  if (assignments.length === 0) {
    return <div>No shifts scheduled for this period.</div>
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{assignment.shift.name}</span>
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
            <p>
              {assignment.shift.start_time} - {assignment.shift.end_time}
            </p>
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

