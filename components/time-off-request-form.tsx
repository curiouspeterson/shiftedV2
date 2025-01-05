/**
 * Time Off Request Form Component
 * 
 * Form component for submitting employee time off requests.
 * Provides a user-friendly interface for selecting dates and providing reasons.
 * 
 * Features:
 * - Date range selection with calendars
 * - Date validation (no past dates, end after start)
 * - Optional reason input
 * - Form validation
 * - Loading states
 * - Success/error notifications
 * - Automatic form reset
 */

"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

/**
 * Component props
 * @property onSubmit - Optional callback function triggered after successful submission
 */
interface TimeOffRequestFormProps {
  onSubmit?: () => void
}

// Initialize Supabase client
const supabase = createClient()

/**
 * Time off request form component
 * Manages form state and submission for time off requests
 */
export function TimeOffRequestForm({ onSubmit }: TimeOffRequestFormProps) {
  // Form field state management
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Form submission handler
   * Validates input and creates time off request record
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate date selection
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
      return
    }

    // Validate date range
    if (endDate < startDate) {
      toast({
        title: "Error",
        description: "End date cannot be before start date",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      // Create time off request record
      const { error } = await supabase
        .from('time_off_requests')
        .insert([
          {
            user_id: user.id,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            reason,
            status: 'pending'
          }
        ])

      if (error) throw error

      // Show success message
      toast({
        title: "Success",
        description: "Time off request submitted successfully",
      })

      // Reset form
      setStartDate(undefined)
      setEndDate(undefined)
      setReason("")
      
      // Call onSubmit callback if provided
      onSubmit?.()
    } catch (error) {
      console.error('Error submitting time off request:', error)
      setError("Failed to submit time off request. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Time Off</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Error alert display */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date selection calendars */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Start date calendar */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()} // Disable past dates
              />
            </div>
            {/* End date calendar */}
            <div className="space-y-2">
              <Label>End Date</Label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="rounded-md border"
                disabled={(date) => date < (startDate || new Date())} // Disable dates before start date
              />
            </div>
          </div>
          {/* Reason input field */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason for requesting time off..."
              className="h-32"
            />
          </div>
          {/* Submit button with loading and validation states */}
          <Button type="submit" disabled={isSubmitting || !startDate || !endDate}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

