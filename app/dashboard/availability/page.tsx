"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AvailabilityForm } from "@/components/availability-form"
import { AvailabilityList } from "@/components/availability-list"

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvailabilities()
  }, [])

  async function fetchAvailabilities() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employee_availability')
        .select('*')
        .order('day_of_week', { ascending: true })
      
      if (error) throw error
      setAvailabilities(data || [])
    } catch (error) {
      console.error('Error fetching availabilities:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Availability</h1>
      <AvailabilityForm onAvailabilityAdded={fetchAvailabilities} />
      {loading ? (
        <p>Loading availabilities...</p>
      ) : (
        <AvailabilityList 
          availabilities={availabilities} 
          onAvailabilityUpdated={fetchAvailabilities}
          onAvailabilityDeleted={fetchAvailabilities}
        />
      )}
    </div>
  )
}

