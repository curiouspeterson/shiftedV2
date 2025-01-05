/**
 * Generate Schedule Button Component
 * 
 * Interactive button component for generating employee schedules.
 * Provides date selection and schedule generation functionality.
 * 
 * Features:
 * - Date picker popover
 * - Schedule generation
 * - Loading states
 * - Error handling
 * - Success notifications
 * - Conflict reporting
 * - Input validation
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

/**
 * Generate schedule button component
 * Manages schedule generation process
 * 
 * Features:
 * - Date selection via calendar
 * - Schedule generation trigger
 * - Loading state management
 * - Error notifications
 * - Success feedback
 */
export function GenerateScheduleButton() {
  // State management
  const [date, setDate] = useState<Date>()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  /**
   * Handles schedule generation
   * Makes API request to generate schedule from selected date
   * 
   * @returns void
   * @throws Error if schedule generation fails
   */
  const handleGenerate = async () => {
    // Validate date selection
    if (!date) {
      toast({
        title: 'Select a start date',
        description: 'Please select a start date for the schedule.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Make API request to generate schedule
      const response = await fetch('/api/schedule/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: format(date, 'yyyy-MM-dd'),
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // Show success message with results
      toast({
        title: 'Schedule generated',
        description: `Created ${data.assignmentsCount} assignments. ${
          data.conflicts.length
            ? `\n${data.conflicts.length} conflicts found.`
            : ''
        }`,
      })
    } catch (error) {
      // Show error message
      toast({
        title: 'Error',
        description: 'Failed to generate schedule. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Date picker popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a start date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Generate button with loading state */}
      <Button onClick={handleGenerate} disabled={!date || isLoading}>
        {isLoading ? 'Generating...' : 'Generate Schedule'}
      </Button>
    </div>
  )
} 