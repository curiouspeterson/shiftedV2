"use client"

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

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase/client'
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

  useEffect(() => {
    let isMounted = true
    let channel: any = null
    let client: ReturnType<typeof createClient> | null = null

    const setupSubscription = async () => {
      try {
        if (!isMounted) return
        setError(null)
        
        client = createClient()
        
        // Get current user
        const { data: { user }, error: authError } = await client.auth.getUser()
        if (authError) throw authError
        if (!user) throw new Error("No user found")
        if (!isMounted) return

        // Fetch initial availability data
        const { data, error } = await client
          .from('employee_availability')
          .select('*')
          .eq('profile_id', user.id)
          .order('day_of_week', { ascending: true })

        if (error) throw error
        if (!isMounted) return
        setSlots(data as AvailabilitySlot[])

        // Set up real-time subscription for changes
        console.log('Setting up availability subscription for user:', user.id)
        const channelName = `availability_${user.id}`
        console.log('Channel name:', channelName)

        channel = client
          .channel(channelName)
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'employee_availability',
              filter: `profile_id=eq.${user.id}`
            }, 
            (payload) => {
              console.log('Received availability update:', payload)
              if (!isMounted) return

              if (payload.eventType === 'INSERT') {
                setSlots(prev => [...prev, payload.new as AvailabilitySlot].sort((a, b) => a.day_of_week - b.day_of_week))
              } else if (payload.eventType === 'DELETE') {
                setSlots(prev => prev.filter(slot => slot.id !== payload.old.id))
              }
            }
          )

        const { error: subError } = await channel.subscribe()
        if (subError) throw subError

        console.log('Successfully subscribed to availability changes')

      } catch (error) {
        console.error('Error setting up subscription:', error)
        if (isMounted) {
          setError('Failed to fetch availability slots. Please try again later.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    setupSubscription()

    return () => {
      isMounted = false
      if (channel) {
        console.log('Cleaning up availability subscription')
        channel.unsubscribe()
      }
      if (client) {
        client.removeChannel(channel)
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
    const client = createClient()
    setIsDeleting(true)
    try {
      const { error } = await client
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
      console.error('Error deleting availability slot:', error)
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