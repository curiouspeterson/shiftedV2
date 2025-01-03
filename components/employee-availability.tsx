"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

type AvailabilityProps = {
  employeeId: string
}

type Availability = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
}

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

const supabase = createClient()

export function EmployeeAvailability({ employeeId }: AvailabilityProps) {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailability()
  }, [employeeId])

  async function fetchAvailability() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employee_availability')
        .select('*')
        .eq('user_id', employeeId)
        .order('day_of_week')

      if (error) throw error
      setAvailability(data || [])
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading availability...</div>
  }

  return (
    <div className="grid gap-4">
      {daysOfWeek.map((day, index) => {
        const dayAvailability = availability.filter(a => a.day_of_week === index)
        return (
          <Card key={day}>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">{day}</h3>
              {dayAvailability.length > 0 ? (
                <div className="space-y-2">
                  {dayAvailability.map((slot) => (
                    <div key={slot.id} className="text-sm text-muted-foreground">
                      {format(new Date(`2000-01-01T${slot.start_time}`), 'h:mm a')} - {format(new Date(`2000-01-01T${slot.end_time}`), 'h:mm a')}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No availability set</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

