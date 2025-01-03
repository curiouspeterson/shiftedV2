"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AvailabilityForm } from "@/components/availability-form"
import { AvailabilityList } from "@/components/availability-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Availability {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAvailabilities()
  }, [])

  const fetchAvailabilities = async () => {
    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('employee_availability')
        .select('*')
        .eq('profile_id', user.id)
        .order('day_of_week')

      if (error) throw error
      setAvailabilities(data || [])
    } catch (error) {
      console.error('Error fetching availabilities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Availability</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Set Your Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <AvailabilityForm onAvailabilityAdded={fetchAvailabilities} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <AvailabilityList 
              availabilities={availabilities} 
              onAvailabilityUpdated={fetchAvailabilities}
              onAvailabilityDeleted={fetchAvailabilities}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}