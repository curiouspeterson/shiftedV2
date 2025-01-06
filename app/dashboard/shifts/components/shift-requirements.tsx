/**
 * Shift Requirements Component
 * 
 * A comprehensive component for managing shift coverage requirements.
 * Allows managers to define, edit, and delete shift requirements for each day of the week.
 * 
 * Features:
 * - View shift requirements by day
 * - Add new requirements
 * - Edit existing requirements
 * - Delete requirements
 * - Time formatting
 * - Loading states
 * - Error handling
 * - Real-time updates
 */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { type ShiftRequirement } from "@/types/schedule"
import { ShiftRequirementDialog } from "./shift-requirement-dialog"

/**
 * Array of day names for mapping numeric day values to readable names
 */
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

/**
 * Shift requirements management component
 * Handles CRUD operations for shift requirements
 */
export function ShiftRequirements() {
  // State management
  const [requirements, setRequirements] = useState<ShiftRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequirement, setSelectedRequirement] = useState<ShiftRequirement | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch requirements on component mount
  useEffect(() => {
    fetchRequirements()
  }, [])

  /**
   * Fetches shift requirements from the database
   * Orders by day of week and start time
   */
  const fetchRequirements = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("shift_requirements")
        .select("*")
        .order("day_of_week")
        .order("start_time")

      if (error) throw error
      setRequirements(data || [])
    } catch (error) {
      console.error("Error fetching shift requirements:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch shift requirements",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Deletes a shift requirement from the database
   * @param id - ID of the requirement to delete
   */
  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("shift_requirements")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Shift requirement deleted successfully",
      })
      fetchRequirements()
    } catch (error) {
      console.error("Error deleting shift requirement:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete shift requirement",
      })
    }
  }

  /**
   * Formats a time string into a readable format
   * @param time - Time string in HH:MM format
   * @returns Formatted time string
   */
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add requirement button */}
      <div className="flex justify-end">
        <Button onClick={() => {
          setSelectedRequirement(null)
          setIsDialogOpen(true)
        }}>
          Add Requirement
        </Button>
      </div>

      {/* Requirements grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requirements.map((requirement) => (
          <Card key={requirement.id}>
            <CardContent className="p-4">
              {/* Requirement details */}
              <div className="space-y-2">
                <h3 className="font-medium">{requirement.name}</h3>
                <p className="text-sm text-gray-500">
                  {DAYS_OF_WEEK[requirement.day_of_week]}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime(requirement.start_time)} - {formatTime(requirement.end_time)}
                </p>
                <p className="text-sm text-gray-500">
                  Required Employees: {requirement.required_count}
                </p>
              </div>
              {/* Action buttons */}
              <div className="mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRequirement(requirement)
                    setIsDialogOpen(true)
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDelete(requirement.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Add dialog */}
      {isDialogOpen && (
        <ShiftRequirementDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          shiftRequirement={selectedRequirement || undefined}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={fetchRequirements}
        />
      )}
    </div>
  )
} 