"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

type ScheduleProps = {
  employeeId: string
}

type ShiftAssignment = {
  id: string
  shift_id: string
  status: string
  shift: {
    name: string
    start_time: string
    end_time: string
  }
}

export function EmployeeSchedule({ employeeId }: ScheduleProps) {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedule()
  }, [employeeId])

  async function fetchSchedule() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('shift_assignments')
        .select(`
          id,
          shift_id,
          status,
          shift:shifts (
            name,
            start_time,
            end_time
          )
        `)
        .eq('user_id', employeeId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAssignments(data || [])
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading schedule...</div>
  }

  return (
    <div className="space-y-4">
      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{assignment.shift.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(`2000-01-01T${assignment.shift.start_time}`), 'h:mm a')} - {format(new Date(`2000-01-01T${assignment.shift.end_time}`), 'h:mm a')}
                  </p>
                </div>
                <div className="text-sm">
                  Status: <span className="capitalize">{assignment.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No shifts scheduled</p>
      )}
    </div>
  )
}

