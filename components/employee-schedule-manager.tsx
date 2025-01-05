/**
 * Employee Schedule Manager Component
 * 
 * A comprehensive component for managing employee shift schedules.
 * Provides functionality for viewing, adding, updating, and deleting shifts
 * for individual employees.
 * 
 * Features:
 * - Date-based schedule viewing
 * - Shift creation with date and time selection
 * - Shift deletion
 * - Real-time updates
 * - Loading states
 * - Error handling with toast notifications
 * 
 * @component
 */

"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { type Employee } from "@/types/employee"
import { type ShiftAssignment } from "@/types/schedule"

/**
 * Props for the EmployeeScheduleManager component
 * @interface
 * @property {Employee} employee - The employee whose schedule is being managed
 * @property {() => void} onUpdate - Callback function to be called after successful schedule updates
 */
interface EmployeeScheduleManagerProps {
  employee: Employee
  onUpdate: () => void
}

export function EmployeeScheduleManager({ employee, onUpdate }: EmployeeScheduleManagerProps) {
  // State management for schedules, loading state, and date filtering
  const [schedules, setSchedules] = useState<ShiftAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

  // Fetch schedules whenever the start date changes
  useEffect(() => {
    fetchSchedules()
  }, [startDate])

  /**
   * Fetches employee schedules from the database
   * Filters schedules based on the selected start date
   * Updates the schedules state and handles loading/error states
   */
  const fetchSchedules = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('shift_assignments')
        .select('*')
        .eq('profile_id', employee.id)
        .gte('date', startDate)
        .lte('date', format(parseISO(startDate), 'yyyy-MM-dd'))
        .order('date')
        .order('start_time')

      if (error) throw error
      setSchedules(data || [])
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch schedules",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles the addition of a new shift
   * Processes form data and creates a new shift assignment in the database
   * @param {React.FormEvent} e - Form submission event
   */
  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('shift_assignments')
        .insert([
          {
            profile_id: employee.id,
            date: formData.get('date'),
            start_time: formData.get('start_time'),
            end_time: formData.get('end_time'),
          },
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Shift added successfully",
      })
      form.reset()
      fetchSchedules()
      onUpdate()
    } catch (error) {
      console.error('Error adding shift:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add shift",
      })
    }
  }

  /**
   * Handles the deletion of an existing shift
   * Removes the shift assignment from the database
   * @param {string} id - ID of the shift to delete
   */
  const handleDeleteShift = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('shift_assignments')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Shift deleted successfully",
      })
      fetchSchedules()
      onUpdate()
    } catch (error) {
      console.error('Error deleting shift:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete shift",
      })
    }
  }

  /**
   * Handles updates to an existing shift
   * Modifies shift assignment details in the database
   * @param {string} id - ID of the shift to update
   * @param {Partial<ShiftAssignment>} updates - Partial shift assignment data to update
   */
  const handleUpdateShift = async (id: string, updates: Partial<ShiftAssignment>) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('shift_assignments')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Shift updated successfully",
      })
      fetchSchedules()
      onUpdate()
    } catch (error) {
      console.error('Error updating shift:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update shift",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Week Starting</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <form onSubmit={handleAddShift} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input id="start_time" name="start_time" type="time" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input id="end_time" name="end_time" type="time" required />
            </div>
          </div>
          <Button type="submit">Add Shift</Button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Scheduled Shifts</h3>
        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : schedules.length > 0 ? (
          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {format(parseISO(schedule.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(parseISO(`2000-01-01T${schedule.start_time}`), 'h:mm a')} -{' '}
                    {format(parseISO(`2000-01-01T${schedule.end_time}`), 'h:mm a')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDeleteShift(schedule.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No shifts scheduled</p>
        )}
      </div>
    </div>
  )
}

