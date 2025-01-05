/**
 * Availability List Component
 * 
 * Displays and manages a list of employee availability time slots.
 * Implements real-time updates using Supabase subscriptions.
 * 
 * Features:
 * - Real-time updates for availability slots
 * - Day and time formatting
 * - Delete functionality
 * - Loading states
 * - Error handling
 * - Empty state handling
 * - Automatic cleanup of subscriptions
 */

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from '@supabase/ssr'
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/**
 * Availability slot data structure
 * @property id - Unique identifier for the availability slot
 * @property profile_id - ID of the employee profile
 * @property day_of_week - Numeric day of week (0-6, Sunday-Saturday)
 * @property start_time - Start time in HH:MM format
 * @property end_time - End time in HH:MM format
 * @property created_at - Record creation timestamp
 */
type AvailabilitySlot = {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
  created_at: string
}

/**
 * Component props
 * @property onAvailabilityDeleted - Optional callback function triggered after successful deletion
 */
interface AvailabilityListProps {
  onAvailabilityDeleted?: () => void
}

/**
 * Maps numeric day values to day names
 */
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

/**
 * Availability list component
 * Displays and manages real-time updates of availability slots
 */
export function AvailabilityList({ onAvailabilityDeleted }: AvailabilityListProps) {
  // State management
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    let subscription: any

    /**
     * Sets up real-time subscription and initial data fetch
     * Handles updates, inserts, and deletions in real-time
     */
    const setupSubscription = async () => {
      try {
        setError(null)
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("No user found")

        // Fetch initial availability data
        const { data, error } = await supabase
          .from('employee_availability')
          .select('*')
          .eq('profile_id', user.id)
          .order('day_of_week', { ascending: true })

        if (error) throw error
        setSlots(data)

        // Set up real-time subscription for changes
        subscription = supabase
          .channel('availability_changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'employee_availability',
              filter: `profile_id=eq.${user.id}`
            }, 
            (payload) => {
              // Handle different types of changes
              if (payload.eventType === 'INSERT') {
                setSlots(prev => [...prev, payload.new as AvailabilitySlot])
              } else if (payload.eventType === 'DELETE') {
                setSlots(prev => prev.filter(slot => slot.id !== payload.old.id))
              }
            }
          )
          .subscribe()

      } catch (error) {
        console.error('Error setting up subscription:', error)
        setError('Failed to fetch availability slots. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    // Initialize subscription
    setupSubscription()

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [])

  /**
   * Formats time string from HH:MM to 12-hour format
   * @param time - Time string in HH:MM format
   * @returns Formatted time string in 12-hour format
   */
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  /**
   * Deletes an availability slot
   * @param id - ID of the slot to delete
   */
  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('employee_availability')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Availability slot deleted successfully",
      })

      onAvailabilityDeleted?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete availability slot",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {slots.length === 0 ? (
            // Show message if no slots exist
            <p className="text-center text-muted-foreground">No availability slots found</p>
          ) : (
            // Map through and display slots
            slots.map((slot) => (
              <Card key={slot.id}>
                <CardContent className="flex items-center justify-between p-4">
                  {/* Day and time range display */}
                  <div className="space-y-1">
                    <p className="font-medium">{DAYS_OF_WEEK[slot.day_of_week]}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </p>
                  </div>
                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(slot.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}