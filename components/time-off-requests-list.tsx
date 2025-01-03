"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

const supabase = createClient()

export function TimeOffRequestsList() {
  const [requests, setRequests] = useState<TimeOffRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let subscription: any

    const setupSubscription = async () => {
      try {
        setError(null)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("No user found")

        // Initial fetch
        const { data, error } = await supabase
          .from('time_off_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setRequests(data)

        // Set up real-time subscription
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

    setupSubscription()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [])

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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

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
            <p className="text-center text-muted-foreground">No time off requests found</p>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {format(new Date(request.start_date), 'MMM d, yyyy')} - {format(new Date(request.end_date), 'MMM d, yyyy')}
                    </p>
                    {request.reason && (
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    )}
                  </div>
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

