"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { type ShiftRequirement } from "@/types/schedule"
import { ShiftRequirementDialog } from "./shift-requirement-dialog"

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export function ShiftRequirements() {
  const [requirements, setRequirements] = useState<ShiftRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequirement, setSelectedRequirement] = useState<ShiftRequirement | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchRequirements()
  }, [])

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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const date = new Date()
    date.setHours(parseInt(hours, 10))
    date.setMinutes(parseInt(minutes, 10))
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => {
          setSelectedRequirement(null)
          setIsDialogOpen(true)
        }}>
          Add Requirement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requirements.map((requirement) => (
          <Card key={requirement.id}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">{DAYS_OF_WEEK[requirement.day_of_week]}</h3>
                <p className="text-sm text-gray-500">
                  {formatTime(requirement.start_time)} - {formatTime(requirement.end_time)}
                </p>
                <p className="text-sm text-gray-500">
                  Required Employees: {requirement.required_count}
                </p>
              </div>
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

      {isDialogOpen && (
        <ShiftRequirementDialog
          shiftRequirement={selectedRequirement || undefined}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={fetchRequirements}
        />
      )}
    </div>
  )
} 