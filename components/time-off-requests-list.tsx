/**
 * Time Off Requests List Component
 * 
 * Displays and manages a list of employee time off requests.
 * Implements real-time updates using Supabase subscriptions.
 * 
 * Features:
 * - Real-time updates for requests
 * - Status-based styling
 * - Date formatting
 * - Loading states
 * - Error handling
 * - Empty state handling
 * - Automatic cleanup of subscriptions
 */

"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/**
 * Time off request data structure
 * @property id - Unique identifier for the request
 * @property user_id - ID of the requesting user
 * @property start_date - Start date of time off
 * @property end_date - End date of time off
 * @property reason - Optional reason for the request
 * @property status - Current status of the request
 * @property created_at - Request creation timestamp
 * @property updated_at - Last update timestamp
 */
type TimeOffRequest = {
  id: string
  user_id: string
  start_date: string
  end_date: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

// Initialize Supabase client
const supabase = createClient()

/**
 * Time off requests list component
 * Displays and manages real-time updates of time off requests
 */
export function TimeOffRequestsList() {
  // State management
  const [requests, setRequests] = useState<TimeOffRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        // Fetch initial requests data
        const { data, error } = await supabase
          .from('time_off_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setRequests(data)

        // Set up real-time subscription for changes
        subscription = supabase
          .channel('time_off_requests_changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'time_off_requests',
              filter: `user_id=eq.${user.id}`
            }, 
            (payload) => {
              // Handle different types of changes
              if (payload.eventType === 'INSERT') {
                setRequests(prev => [payload.new as TimeOffRequest, ...prev])
              } else if (payload.eventType === 'UPDATE') {
                setRequests(prev => prev.map(request => 
                  request.id === payload.new.id ? payload.new as TimeOffRequest : request
                ))
              } else if (payload.eventType === 'DELETE') {
                setRequests(prev => prev.filter(request => request.id !== payload.old.id))
              }
            }
          )
          .subscribe()

      } catch (error) {
        console.error('Error setting up subscription:', error)
        setError('Failed to fetch time off requests. Please try again later.')
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
   * Determines badge color based on request status
   * @param status - Current status of the request
   * @returns CSS class for badge background color
   */
  const getStatusColor = (status: TimeOffRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
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
        <CardTitle>Your Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.length === 0 ? (
            // Show message if no requests exist
            <p className="text-center text-muted-foreground">No time off requests found</p>
          ) : (
            // Map through and display requests
            requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="flex items-center justify-between p-4">
                  {/* Request date range and reason */}
                  <div className="space-y-1">
                    <p className="font-medium">
                      {format(new Date(request.start_date), 'MMM d, yyyy')} - {format(new Date(request.end_date), 'MMM d, yyyy')}
                    </p>
                    {request.reason && (
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    )}
                  </div>
                  {/* Status badge */}
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

