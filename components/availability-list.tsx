"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createBrowserClient } from '@supabase/ssr'
import { toast } from "@/components/ui/use-toast"

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

interface Availability {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

interface AvailabilityListProps {
  availabilities: Availability[]
  onAvailabilityUpdated: () => void
  onAvailabilityDeleted: () => void
}

export function AvailabilityList({
  availabilities,
  onAvailabilityUpdated,
  onAvailabilityDeleted
}: AvailabilityListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStartTime, setEditStartTime] = useState("")
  const [editEndTime, setEditEndTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = (availability: Availability) => {
    setEditingId(availability.id)
    setEditStartTime(availability.start_time)
    setEditEndTime(availability.end_time)
  }

  const handleUpdate = async (id: string) => {
    setIsLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase
        .from('employee_availability')
        .update({
          start_time: editStartTime,
          end_time: editEndTime
        })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Availability updated successfully",
      })

      setEditingId(null)
      onAvailabilityUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update availability",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase
        .from('employee_availability')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Availability deleted successfully",
      })

      onAvailabilityDeleted()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete availability",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (availabilities.length === 0) {
    return <p className="text-muted-foreground">No availabilities set.</p>
  }

  return (
    <div className="space-y-4 mt-6">
      {availabilities.map((availability) => (
        <div key={availability.id} className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="flex-1">
            <p className="font-medium">{DAYS_OF_WEEK[availability.day_of_week]}</p>
            {editingId === availability.id ? (
              <div className="flex gap-2 mt-2">
                <Input
                  type="time"
                  value={editStartTime}
                  onChange={(e) => setEditStartTime(e.target.value)}
                />
                <span className="self-center">to</span>
                <Input
                  type="time"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {availability.start_time} to {availability.end_time}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {editingId === availability.id ? (
              <>
                <Button
                  size="sm"
                  onClick={() => handleUpdate(availability.id)}
                  disabled={isLoading}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(availability)}
                  disabled={isLoading}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(availability.id)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}