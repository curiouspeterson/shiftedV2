/**
 * Availability Page Component
 * 
 * Main page for managing employee availability settings.
 * Combines availability form and list components in a grid layout.
 * 
 * Features:
 * - Real-time availability management
 * - Add new availability slots
 * - View current availability
 * - State synchronization
 * - Loading states
 * - Error handling
 * - Responsive grid layout
 */

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AvailabilityForm } from "@/components/availability-form"
import { AvailabilityList } from "@/components/availability-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Availability data structure
 * @property id - Unique identifier for the availability slot
 * @property profile_id - ID of the employee profile
 * @property day_of_week - Numeric day of week (0-6, Sunday-Saturday)
 * @property start_time - Start time in HH:MM format
 * @property end_time - End time in HH:MM format
 */
interface Availability {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

/**
 * Availability page component
 * Manages the overall availability section
 */
export default function AvailabilityPage() {
  // State management
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch availabilities on component mount
  useEffect(() => {
    fetchAvailabilities()
  }, [])

  /**
   * Fetches user's availability slots from the database
   * Handles authentication and data retrieval
   */
  const fetchAvailabilities = async () => {
    try {
      const supabase = createClient()
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('No user found')

      // Fetch availability data
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
        {/* Availability form card */}
        <Card>
          <CardHeader>
            <CardTitle>Set Your Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <AvailabilityForm onAvailabilityAdded={fetchAvailabilities} />
          </CardContent>
        </Card>

        {/* Current availability card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <AvailabilityList onAvailabilityDeleted={fetchAvailabilities} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}